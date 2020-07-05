<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable placeholder="输入课程名或者课程号搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="68px">
          <el-form-item label="课程名" prop="courseName">
            <el-input v-model="form.courseName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="院校">
            <treeselect
              v-model="form.college.id"
              :options="colleges"
              :load-options="loadColleges"
              style="width: 370px"
              placeholder="选择院校"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="46" />
        <el-table-column prop="courseName" label="课程名" align="center" />
        <el-table-column prop="college.name" min-width="140px" label="归属院校" align="center" />
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudClass from '@/web/api/class'
import { getDepts, getDeptSuperior } from '@/web/api/dept'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import Treeselect from '@riophae/vue-treeselect'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import pagination from '@/components/Crud/Pagination'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '课程管理', url: 'api/course', sort: 'id,desc', crudMethod: { ...crudClass }})
const defaultForm = {
  id: null,
  courseName: null,
  courseCode: null,
  enabled: 'true',
  joinPermission: 'true',
  studentCount: '0',
  teacherName: null,
  college: { id: null },
  userName: null,
  signCount: '0',
  semester: null
}
export default {
  name: 'Course',
  components: { Treeselect, pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      deptName: '', colleges: [], studentDialog: false, studentData: null,
      permission: {
        add: ['admin', 'course:add'],
        edit: ['admin', 'course:edit'],
        del: ['admin', 'course:del']
      },
      rules: {
        courseName: [
          { required: true, message: '课程名不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'courseName', display_name: '课程名' },
        { key: 'courseCode', display_name: '课程编码' },
        { key: 'belongCollege', display_name: '归属院校' }
      ]
    }
  },
  computed: {
    signRate(att, abs) {
      return function(att, abs) {
        if (att > 0) {
          const cal = att / (att + abs)
          return parseInt(cal * 100)
        } else {
          return 0
        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      // this.getD
    })
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      // 将true或者false值转化成字符串，单选才能显示
      form.enabled = `${form.enabled}`
      form.joinPermission = `${form.joinPermission}`
      if (form.id === null) {
        this.getDepts()
      } else {
        this.getSupDepts(form.college.id)
      }
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.colleges = res.content
      })
    },
    getSupDepts(deptId) {
      getDeptSuperior(deptId).then(res => {
        const date = res.content
        this.buildColleges(date)
        this.colleges = date
      })
    },
    buildColleges(depts) {
      depts.forEach(data => {
        if (data.children) {
          this.buildColleges(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    loadColleges({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
