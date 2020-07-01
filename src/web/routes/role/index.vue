<template>
  <el-card class="box-card">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <span>角色名：</span>
        <el-input
          v-model="query.blurry"
          clearable
          size="small"
          placeholder="输入菜单名称搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation />
      </div>
      <crudOperation />
    </div>
    <div>
      <el-table
        ref="table"
        v-loading="crud.loading"
        highlight-current-row
        style="width: 100%;"
        align="center"
        :data="crud.data"
        @selection-change="crud.selectionChangeHandler"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="id"
          label="编号"
          width="80"
        />
        <el-table-column
          prop="name"
          label="角色名"
          width="100"
        />
        <el-table-column
          prop="dataScope"
          label="数据权限"
        />
        <el-table-column
          prop="level"
          label="角色级别"
        />
        <el-table-column
          prop="description"
          label="描述"
          width="200"
        />
        <el-table-column label="操作" width="150px" align="center" fixed="right">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination />
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="550px"
    >
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名" clearable />
        </el-form-item>
        <el-form-item label="角色级别" prop="level" size="mini">
          <el-input-number v-model="form.level" :min="1" :max="999" clearable />
        </el-form-item>
        <el-form-item label="数据权限" prop="dateScope">
          <el-select v-model="form.dataScope" placeholder="请选择数据权限" @change="changeScope">
            <el-option
              v-for="item in dateScopes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.dataScope === '自定义'" label="数据权限" prop="depts">
          <treeselect
            v-model="form.depts"
            :load-options="loadDepts"
            :options="depts"
            multiple
            style="width: 380px"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item v-if="form.id !== null" label="菜单权限">
          <treeselect
            v-model="menuIds"
            :options="menus"
            :load-options="loadMenus"
            multiple
            style="width: 380px"
            placeholder="请选择菜单"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description" size="mini">
          <el-input
            v-model="form.description"
            type="textarea"
            autosize
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        <el-button @click="crud.cancelCU">取消</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import crudRoles from '@/web/api/role'
import { getDepts, getDeptSuperior } from '@/web/api/dept'
import { getMenus, getMenuSuperior } from '@/web/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import pagination from '@/components/Crud/Pagination'

const defaultForm = { id: null, name: null, depts: [], description: null, dataScope: '全部', level: 3 }

export default {
  name: 'Role',
  components: {
    Treeselect,
    pagination,
    crudOperation,
    rrOperation,
    udOperation
  },
  cruds() {
    return CRUD({ title: '角色', url: 'api/roles', sort: 'level,asc', crudMethod: { ...crudRoles }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      defaultProps: { children: 'children', label: 'label', isLeaf: 'leaf' },
      dateScopes: ['全部', '本级', '自定义'],
      currentId: 0, menuLoading: false, showButton: false,
      valueConsistsOf: 'ALL',
      menus: [], menuIds: [], depts: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入权限', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // getMenuDatas(node, resolve) {
    //   setTimeout(() => {
    //     getMenusTree(node.data.id ? node.data.id : 0).then(res => {
    //       console.log('res:', res)
    //       resolve(res)
    //     })
    //   }, 100)
    // },
    // [CRUD.HOOK.afterRefresh]() {
    //   this.$refs.menu.setCheckedKeys([])
    // },
    // 添加前
    [CRUD.HOOK.beforeToAdd](crud, form) {
      console.log('beforeToAddform:', this.form)
      this.menuIds = []
      this.getMenus()
    },
    // 添加后
    [CRUD.HOOK.afterToAdd](crud, form) {
      console.log('afterToAdd:', this.form)
    },
    // 编辑前
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.menuIds = []
      if (form.dataScope === '自定义') {
        if (form.id === null) {
          this.getDepts()
        } else {
          this.getSupDepts(form.depts)
        }
      }
      if (form.id === null) {
        this.getMenus()
      } else {
        this.getSupMenus(form.menus)
        const menus = []
        form.menus.forEach(function(menu) {
          menus.push(menu.id)
        })
        this.menuIds = menus
      }
      console.log('menuIds:', this.menuIds)
      console.log('depts:', form.depts)
      const depts = []
      form.depts.forEach(function(dept) {
        depts.push(dept.id)
      })
      form.depts = depts
      console.log('menus:', form.menus)
      console.log('depts:', form.depts)
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (crud.form.dataScope === '自定义' && crud.form.depts.length === 0) {
        this.$message({
          message: '自定义数据权限不能为空',
          type: 'warning'
        })
        return false
      } else if (crud.form.dataScope === '自定义') {
        const depts = []
        crud.form.depts.forEach(function(data) {
          const dept = { id: data }
          depts.push(dept)
        })
        crud.form.depts = depts
      } else {
        crud.form.depts = []
      }
      if (crud.form.id !== null) {
        this.saveMenu()
      }
      return true
    },
    [CRUD.HOOK.afterAddError](crud) {
      this.afterErrorMethod(crud)
    },
    [CRUD.HOOK.afterEditError](crud) {
      this.afterErrorMethod(crud)
    },
    afterErrorMethod(crud) {
      // 部门
      const depts = []
      crud.form.depts.forEach(function(dept) {
        depts.push(dept.id)
      })
      crud.form.depts = depts
    },
    // 改变数据
    update() {
      // 无刷新更新 表格数据
      crudRoles.get(this.currentId).then(res => {
        for (let i = 0; i < this.crud.data.length; i++) {
          if (res.id === this.crud.data[i].id) {
            this.crud.data[i] = res
            break
          }
        }
      })
    },
    // 获取部门数据
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupDepts(depts) {
      const ids = []
      depts.forEach(dept => {
        ids.push(dept.id)
      })
      getDeptSuperior(ids).then(res => {
        const date = res.content
        console.log('getDeptSuperior', date)
        this.buildDepts(date)
        this.depts = date
      })
    },
    buildDepts(depts) {
      console.log('buildDepts', depts)
      depts.forEach(data => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 获取弹窗内部门数据
    loadDepts({ action, parentNode, callback }) {
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
    // 获取菜单数据
    getMenus() {
      getMenus({ enabled: true }).then(res => {
        this.menus = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupMenus(menus) {
      const ids = []
      menus.forEach(menu => {
        ids.push(menu.id)
      })
      getMenuSuperior(ids).then(res => {
        const date = res
        console.log('getMenuSuperior', date)
        this.buildMenus(date)
        this.menus = date
      })
    },
    buildMenus(menus) {
      console.log('buildMenus', menus)
      menus.forEach(data => {
        if (data.children) {
          this.buildMenus(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 获取弹窗内菜单数据
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getMenus({ enabled: true, pid: parentNode.id }).then(res => {
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
    // 如果数据权限为自定义则获取部门数据
    changeScope() {
      console.log(this.form.dataScope)
      if (this.form.dataScope === '自定义') {
        this.getDepts()
      }
    },
    checkboxT(row) {
      return row.level >= this.level
    },
    // 触发单选
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 保存当前的角色id
        this.currentId = val.id
        // 初始化默认选中的key
        this.menuIds = []
        val.menus.forEach(function(data) {
          _this.menuIds.push(data.id)
        })
      }
    },
    // 保存菜单
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, menus: [] }
      // 得到已选中的 key 值
      this.menuIds.forEach(function(id) {
        const menu = { id: id }
        role.menus.push(menu)
      })
      crudRoles.editMenu(role).then(() => {
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
    margin: 15px;
    width: 95%;
}
.el-row {
    margin-top: 10px;
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
<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: center;
  }
  /deep/ .vue-treeselect__multi-value{
    margin-bottom: 0;
  }
  /deep/ .vue-treeselect__multi-value-item{
    border: 0;
    padding: 0;
  }
</style>
