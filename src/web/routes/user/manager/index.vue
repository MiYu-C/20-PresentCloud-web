<template>
  <div>
    <el-card class="box-card">
      <div>
        <el-row>
          <span>帐号：</span>
          <el-input
            v-model="account"
            placeholder="请输入帐号"
            style="width: 200px;"
          />
          <span>或姓名：</span>
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
          <!-- <el-button size="small">批量操作</el-button> -->
        </el-row>
      </div>
      <div>
        <el-table
          v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          row-key="id"
          border
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="name"
            label="昵称"
          />
          <el-table-column
            prop="account"
            label="帐号"
          />
          <el-table-column
            prop="roles"
            label="角色"
            width="155"
          >
            <template slot-scope="scope">
              {{ scope.row.roles.join(' ') }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="datapermission"
            label="数据权限"
          /> -->
          <el-table-column
            prop="school"
            label="学校/单位"
          />
          <el-table-column
            prop="department"
            label="院系/部门"
          />
          <el-table-column
            prop="phone"
            label="联系电话"
          />
          <el-table-column label="操作" width="150">
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
      </div>
    </el-card>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="visible"
      width="50%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="22">
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="80px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" placeholder="请输入帐号" clearable />
            <!-- <span>{{ form.account }}</span> -->
          </el-form-item>
          <el-form-item label="角色">
            <!-- <el-input v-model="form.roles" placeholder="请输入帐号" clearable /> -->
            <el-select v-model="form.roles" multiple placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="数据权限" prop="account">
            <el-input v-model="form.address" placeholder="请输入帐号" clearable />
          </el-form-item> -->
          <el-form-item label="学校/单位">
            <el-select v-model="job[0]" placeholder="请选择学校/单位">
              <el-option
                v-for="item in schoolList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="院系/部门">
            <el-select v-model="job[1]" :disabled="disabled" placeholder="请选择院系/部门">
              <el-option
                v-for="item in departmentList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="form.phone" placeholder="请输入联系电话" clearable />
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
        <el-button type="primary" @click="delete1">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getList, updateList, addItem, deleteItem, isExist } from '@/web/api/userinfo'
import { getList as getRoleList } from '@/web/api/role'
export default {
  data() {
    const accountValidate = (rule, value, callback) => {
      console.log('isExist', this.form.id, this.form.account)
      if (this.form.account === '') {
        callback('不能为空')
      }
      isExist(this.form.id, this.form.account, this.form.type, 'account').then(response => {
        const exist = response.data
        console.log('exist', exist)
        if (exist) {
          callback('帐号' + value + '已存在')
        } else {
          callback()
        }
      })
    }
    return {
      dialogTitle: '',
      visible: false,
      disabled: true,
      deleteVisible: false,
      account: '',
      type: 3,
      total: 0,
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      listLoading: true,
      tableData: [],
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: accountValidate, trigger: 'blur' }
        ]
      },
      defaultForm: {
        id: 0,
        name: '',
        userID: '',
        account: '',
        roles: [],
        gender: '',
        school: '公司',
        department: '',
        phone: '',
        type: 3
      },
      form: null,
      row: null,
      job: ['', ''],
      schoolList: ['公司', '福州大学'],
      departmentList: [],
      roleList: []
    }
  },
  watch: {
    form(n, o) {
      this.disabled = true
      console.log('school', n.school)
      this.job = [n.school, n.department]
    },
    job(n, o) {
      if (n[0] === '公司') {
        this.departmentList = ['运维', '开发']
        this.disabled = false
      }
      if (n[0] === '福州大学') {
        this.departmentList = ['数计学院', '外语学院', '物信学院']
        this.disabled = false
      }
      if (this.departmentList.findIndex(item => item === n[1]) === -1) {
        n[1] = this.departmentList[0]
      }
    }
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.defaultForm))
    this.row = JSON.parse(JSON.stringify(this.defaultForm))
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.currentPage, this.pagesize, this.type, this.name, this.account).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        console.log('search', this.tableData, this.total)
        if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
          this.currentPage -= 1
          this.fetchData()
        }
        this.listLoading = false
      })
      getRoleList(-1, -1, '').then(response => {
        this.roleList = response.data.items
        console.log('roleList', this.roleList)
      })
    },
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('编辑成功!')
          console.log('form', this.form)
          this.listLoading = true
          this.form.school = this.job[0]
          this.form.department = this.job[1]
          if (this.form.id === 0) {
            addItem(this.form).then(response => {
              console.log('add', response.data)
              this.newItem = response.data
              console.log('afterAdd', response.data)
            })
          } else {
            updateList(this.form).then(response => {
              console.log('update', response.data)
            })
          }
          this.closeForm()
          this.fetchData()
        }
      })
    },
    delete1() {
      deleteItem(this.form).then(response => {
        console.log('delete', response.data)
        this.total = response.data
      })
      this.closeForm()
      this.fetchData()
    },
    closeForm() {
      this.visible = false
      this.deleteVisible = false
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
    },
    search() {
      if (this.name.length > 0 && this.account.length > 0) {
        this.$message('只能同时搜索一项')
      } else {
        this.listLoading = true
        this.currentPage = 1
        console.log('search', this.name.length, this.currentPage)
        this.fetchData()
      }
    },
    resetData() {
      this.listLoading = true
      this.currentPage = 1
      this.name = ''
      this.account = ''
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.row = JSON.parse(JSON.stringify(this.defaultForm))
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
      console.log('defaultForm', this.defaultForm)
      this.dialogTitle = '添加管理员'
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      console.log('form', this.form)
      this.visible = true
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑信息'
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.visible = true
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.deleteVisible = true
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
