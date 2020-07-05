<template>
  <div class="app-container">
    <el-card class="box-card">
      <div>
        <el-row>
          <span>课程名：</span>
          <el-input
            v-model="name"
            placeholder="请输入课程"
            style="width: 200px;"
          />
          <el-button type="primary" style="margin-left: 10px" @click="search">查询</el-button>
          <el-button @click="resetData">重置</el-button>
        </el-row>
        <el-row>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加</el-button>
          <el-button :disabled="ids.length === 0" type="danger" size="small" @click="deleteVisible = true">删除</el-button>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-table
            ref="table"
            v-loading="listLoading"
            :data="tableData"
            style="width: 100%"
            row-key="id"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="id"
              label="课程编号"
            />
            <el-table-column
              prop="courseName"
              label="课程名"
              align="center"
            />
            <el-table-column
              prop="college.name"
              min-width="140px"
              label="归属院校"
              align="center"
            />
            <el-table-column label="操作" width="170">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-pagination
            background
            :current-page="currentPage"
            :page-sizes="pagesizes"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </div>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="visible"
        width="500px"
        :show-close="false"
        :destroy-on-close="true"
      >
        <el-col :span="22">
          <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="80px">
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
        </el-col>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="update">确 定</el-button>
          <el-button @click="closeForm">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="deleteVisible"
        width="30%"
        :show-close="false"
        :destroy-on-close="true"
      >
        <el-col :span="22">
          <span>确认删除选中项？</span>
        </el-col>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="deleteData">确 定</el-button>
          <el-button @click="closeForm">取 消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import crudClass from '@/web/api/class'
import { getDepts, getDeptSuperior } from '@/web/api/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { Notification } from 'element-ui'

export default {
  components: { Treeselect },
  data() {
    return {
      addLoading: false,
      editLoading: false,
      dialogTitle: '',
      visible: false,
      disabled: true,
      deleteVisible: false,
      total: 0,
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      listLoading: true,
      tableData: [],
      defaultForm: {
        id: null,
        className: null,
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
      },
      form: null,
      row: null,
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      colleges: [],
      ids: []
    }
  },
  created() {
    this.fetchData()
    this.form = JSON.parse(JSON.stringify(this.defaultForm))
    this.row = JSON.parse(JSON.stringify(this.defaultForm))
  },
  methods: {
    fetchData() {
      this.ids = []
      this.listLoading = true
      const page = 0
      const size = 999
      const sort = 'id,desc'
      const blurry = this.name
      let params = null
      params = { page, size, sort, blurry }
      crudClass.get(params).then(response => {
        const content = response.content
        const res = new Map()
        this.tableData = content.filter((arr) => {
          let value = [arr.courseName, arr.college.id]
          value = value.toString()
          return !res.has(value) && res.set(value, 1)
        })
        this.total = this.tableData.length
        if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
          this.currentPage -= 1
          this.fetchData()
        }
        this.tableData = this.tableData.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize)
        this.listLoading = false
      })
    },
    search() {
      if (this.name.length === 0) {
        this.$message('不能为空')
      } else {
        this.listLoading = true
        this.currentPage = 1
        console.log('search', this.name.length, this.currentPage)
        this.fetchData()
      }
    },
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('form', this.form)
          this.form.className = this.form.courseName
          this.listLoading = true
          if (this.form.id === null) {
            crudClass.add(this.form).then(response => {
              console.log('afterAdd', response)
              this.notifiSuccess('新增成功')
            }).catch(() => {
              this.notifiError('新增失败')
            })
          } else {
            crudClass.edit(this.form).then(response => {
              console.log('update', response)
              this.notifiSuccess('编辑成功')
            }).catch(() => {
              this.notifiError('编辑失败')
            })
          }
          this.closeForm()
          this.fetchData()
        }
      })
    },
    deleteData() {
      crudClass.del(this.ids).then(response => {
        console.log('delete', response)
        this.row = JSON.parse(JSON.stringify(this.defaultForm))
        this.$refs.table.setCurrentRow()
        this.notifiSuccess('删除成功')
        this.fetchData()
      }).catch(() => {
        this.notifiError('删除失败')
      })
      this.closeForm()
      this.closeForm()
      this.fetchData()
    },
    closeForm() {
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.ids = []
      this.visible = false
      this.deleteVisible = false
    },
    resetData() {
      this.listLoading = true
      this.currentPage = 1
      this.name = ''
      this.fetchData()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      console.log(this.pagesize)
      this.pagesize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      console.log(this.currentPage)
      this.currentPage = val
      this.fetchData()
    },
    handleAdd() {
      this.dialogTitle = '添加课程'
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.getDepts()
      this.visible = true
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑信息'
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.getSupDepts(this.form.college.id)
      setTimeout(this.visible = true, 300)
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.ids = [this.form.id]
      this.deleteVisible = true
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.colleges = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
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
    },
    handleSelectionChange(val) {
      console.log('val', val)
      const ids = []
      val.forEach(data => {
        ids.push(data.id)
      })
      this.ids = ids
      console.log('多选', this.ids)
    },
    notifiSuccess(title) {
      Notification.success({
        title: title,
        duration: 4000
      })
    },
    notifiError(title) {
      Notification.error({
        title: title,
        duration: 4000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// .box-card {
//     margin: 15px;
//     width: 95%;
// }
.el-row {
    // margin-top: 10px;
    margin-bottom: 10px;
    &:last-child {
    margin-bottom: 0;
    }
}
.row-bg {
    margin: 15px;
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
