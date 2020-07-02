<template>
  <el-row>
    <el-col :span="17">
      <el-card class="box-card">
        <el-row>
          <span>姓名：</span>
          <el-input
            v-model="name"
            placeholder="请输入姓名"
            style="width: 200px;"
          />
          <el-button type="primary" style="margin-left: 10px" @click="search">查询</el-button>
          <el-button @click="resetData">重置</el-button>
        </el-row>
        <el-row>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加</el-button>
          <el-button :disabled="ids.length === 0" type="danger" size="small" @click="deleteVisible = true">删除</el-button>
        </el-row>
        <el-table
          v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="nickName"
            label="昵称"
          />
          <el-table-column
            prop="username"
            label="帐号"
            width="155"
          />
          <el-table-column
            prop="type"
            label="身份"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.type.toString() === '1' ? '员工' : '教师' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="gender"
            label="性别"
          />
          <el-table-column
            prop="phone"
            label="电话"
            width="135"
          />
          <el-table-column
            prop="email"
            label="邮箱"
            width="155"
          />
          <el-table-column label="操作" width="150" fixed="right">
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
        <el-dialog
          :title="dialogTitle"
          :visible.sync="visible"
          width="650px"
          :show-close="false"
          :destroy-on-close="true"
        >
          <el-col :span="22">
            <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" />
              </el-form-item>
              <el-form-item label="昵称" prop="nickName">
                <el-input v-model="form.nickName" />
              </el-form-item>
              <el-form-item label="电话" prop="phone">
                <el-input v-model.number="form.phone" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" />
              </el-form-item>
              <el-form-item label="院校/部门" prop="dept.id">
                <treeselect
                  v-model="form.dept.id"
                  :options="depts"
                  :load-options="loadDepts"
                  style="width: 180px"
                  placeholder="选择院校/部门"
                />
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="form.gender" style="width: 150px">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="帐号状态">
                <el-radio-group v-model="form.enabled" style="width: 150px">
                  <el-radio label="true">启用</el-radio>
                  <el-radio label="false">停用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
                <el-select
                  v-model="form.roles"
                  style="width: 250px"
                  multiple
                  placeholder="请选择"
                  @remove-tag="deleteTag"
                  @change="changeRole"
                >
                  <el-option
                    v-for="item in roles"
                    :key="item.name"
                    :disabled="level !== 1 && item.level <= level"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="update">确 定</el-button>
            <el-button @click="closeForm">取 消</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="确认删除"
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
    </el-col>
    <el-col :span="6">
      <el-card class="box-card">
        <div class="head-container">
          <el-input
            v-model="deptName"
            clearable
            size="small"
            placeholder="输入院校/部门名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
            @input="getDeptDatas"
          />
        </div>
        <el-tree
          :data="depts"
          :load="getDeptDatas"
          :props="defaultProps"
          :expand-on-click-node="false"
          lazy
          @node-click="handleNodeClick"
        />
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import crudUser from '@/web/api/userinfo'
import { getDepts, getDeptSuperior } from '@/web/api/dept'
import { getAll, getLevel } from '@/web/api/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

export default {
  components: { Treeselect },
  data() {
    const accountValidate = (rule, value, callback) => {
      console.log('isExist', this.form.id, this.form.account)
      if (this.form.account === '') {
        callback('不能为空')
      }
    }
    return {
      dialogTitle: '',
      visible: false,
      disabled: true,
      deleteVisible: false,
      total: 0,
      name: '',
      deptName: '',
      deptId: null,
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      listLoading: true,
      tableData: [],
      defaultForm: {
        id: null,
        username: null,
        nickName: null,
        gender: '男',
        type: 2,
        email: null,
        enabled: 'false',
        roles: [],
        jobs: [],
        dept: { id: null },
        phone: null
      },
      form: null,
      row: null,
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        userID: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: accountValidate, trigger: 'blur' }
        ]
      },
      depts: [],
      roles: [],
      level: 3,
      userRoles: [],
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
      this.listLoading = true
      const page = this.currentPage - 1
      const size = this.pagesize
      const sort = 'id,desc'
      const blurry = this.name
      const deptId = this.deptId
      let params = null
      // if (blurry !== null && blurry !== '') {
      //   params = { page, size, sort, blurry }
      // } else {
      //   params = { page, size, sort }
      // }
      params = { page, size, sort, blurry, deptId }
      crudUser.get(params).then(response => {
        this.tableData = response.content
        this.total = response.totalElements
        console.log('search', this.tableData, this.total)
        if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
          this.currentPage -= 1
          this.fetchData()
        }
        this.listLoading = false
      })
    },
    search() {
      this.listLoading = true
      this.currentPage = 1
      console.log('search', this.name.length, this.currentPage)
      this.fetchData()
    },
    resetData() {
      this.listLoading = true
      this.currentPage = 1
      this.name = ''
      this.fetchData()
    },
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.form.dept.id) {
            this.$message({
              message: '院校/部门不能为空',
              type: 'warning'
            })
            return false
          } else if (this.form.roles.length === 0) {
            this.$message({
              message: '角色不能为空',
              type: 'warning'
            })
            return false
          }
          if (this.form.dept.id === 56 || this.form.dept.id === 57) {
            this.form.type = 1
          }
          this.form.roles = this.userRoles
          console.log('编辑成功!')
          console.log('form', this.form)
          this.listLoading = true
          if (this.form.id === null) {
            crudUser.add(this.form).then(response => {
              console.log('add', response)
              this.closeForm()
              this.fetchData()
            })
          } else {
            crudUser.edit(this.form).then(response => {
              console.log('update', response)
              this.closeForm()
              this.fetchData()
            })
          }
        }
      })
    },
    deleteData() {
      crudUser.del(this.ids).then(response => {
        console.log('delete', response)
        this.fetchData()
      })
      this.closeForm()
    },
    closeForm() {
      this.visible = false
      this.deleteVisible = false
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
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
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.getRoles()
      if (this.form.id === null) {
        this.getDepts()
      } else {
        this.getSupDepts(this.form.dept.id)
      }
      this.getRoleLevel()
      this.form.enabled = this.form.enabled.toString()
      console.log('defaultForm', this.defaultForm)
      this.dialogTitle = '添加管理员'
      console.log('form', this.form)
      this.visible = true
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑信息'
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.getRoles()
      if (this.form.id === null) {
        this.getDepts()
      } else {
        this.getSupDepts(this.form.dept.id)
      }
      this.getRoleLevel()
      this.form.enabled = this.form.enabled.toString()
      const roles = []
      const userRoles = []
      this.form.roles.forEach(function(role, index) {
        roles.push(role.id)
        // 初始化编辑时候的角色
        const rol = { id: role.id }
        userRoles.push(rol)
      })
      this.userRoles = userRoles
      this.form.roles = roles
      this.visible = true
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.ids = [this.form.id]
      this.deleteVisible = true
    },
    getDeptDatas(node, resolve) {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getDepts(params).then(res => {
          if (resolve) {
            resolve(res.content)
          } else {
            this.depts = res.content
          }
        })
      }, 100)
    },
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
    getSupDepts(deptId) {
      getDeptSuperior(deptId).then(res => {
        const date = res.content
        this.buildDepts(date)
        this.depts = date
      })
    },
    buildDepts(depts) {
      depts.forEach(data => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
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
    getRoles() {
      getAll().then(res => {
        this.roles = res
      }).catch(() => { })
    },
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.level
      }).catch(() => { })
    },
    changeRole(value) {
      const userRoles = []
      value.forEach(function(data, index) {
        const role = { id: data }
        userRoles.push(role)
      })
      this.userRoles = userRoles
    },
    deleteTag(value) {
      this.userRoles.forEach(function(data, index) {
        if (data.id === value) {
          this.userRoles.splice(index, value)
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      console.log(row)
      if (row.enabled.toString() === 'false') {
        return 'warning-row'
      } else {
        return ''
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
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.deptId = null
      } else {
        this.deptId = data.id
      }
      this.fetchData()
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
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
