<template>
  <el-card class="box-card">
    <div>
      <el-row>
        <span>工号：</span>
        <el-input
          v-model="userID"
          placeholder="请输入工号"
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
          label="姓名"
        />
        <el-table-column
          prop="userID"
          label="工号"
        />
        <el-table-column
          prop="gender"
          label="性别"
        />
        <el-table-column
          prop="roles"
          label="角色"
        >
          <template slot-scope="scope">
            {{ scope.row.roles.join(' ') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="school"
          label="学校"
        />
        <el-table-column
          prop="department"
          label="院系"
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
          <el-form-item label="工号" prop="userID">
            <el-input v-model="form.userID" placeholder="请输入工号" clearable />
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
            <el-select v-model="job[0]" filterable placeholder="请选择学校">
              <el-option
                v-for="item in schoolList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="院系/部门">
            <el-select v-model="job[1]" :disabled="disabled" placeholder="请选择院系">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
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
  </el-card>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getList, updateList, addItem, deleteItem, isExist } from '@/web/api/userinfo'
import { getList as getRoleList } from '@/web/api/role'
import { getList as getJobList } from '@/web/api/school'
export default {
  data() {
    const accountValidate = (rule, value, callback) => {
      console.log('isExist', this.form.id, this.form.account)
      if (this.form.account === '') {
        callback('不能为空')
      }
      isExist(this.form.id, this.form.userID, this.form.type, 'userID').then(response => {
        const exist = response.data
        console.log('exist', exist)
        if (exist) {
          callback('工号' + value + '已存在')
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
      userID: '',
      type: 2,
      total: 0,
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      listLoading: true,
      tableData: [],
      defaultForm: {
        id: 0,
        name: '',
        userID: '',
        account: '-',
        roles: [],
        gender: '',
        datapermission: '',
        school: '',
        department: '',
        major: '',
        phone: '',
        type: 2
      },
      form: null,
      row: null,
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        userID: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { validator: accountValidate, trigger: 'blur' }
        ]
      },
      job: ['', ''],
      schoolList: [],
      departmentList: [],
      roleList: [],
      index: 0,
      fatherId: 0
    }
  },
  watch: {
    form(n, o) {
      this.disabled = true
      console.log('school', n.school)
      this.job = [n.school, n.department]
    },
    job(n, o) {
      this.disabled = true
      if (this.schoolList.length > 0) {
        this.index = this.schoolList.findIndex(item => item.name === n[0])
        if (this.index > -1) {
          this.disabled = false
          console.log('disabled', this.disabled)
          this.fatherId = this.schoolList[this.index].id
          console.log('fatherId', this.fatherId)
          getJobList(-1, -1, 2, '', this.fatherId).then(response => {
            this.departmentList = response.data.items
            console.log('departmentList', this.departmentList)
            console.log('department', n[1])
            if (this.departmentList.findIndex(item => item.name === n[1]) === -1) {
              n[1] = this.departmentList[0]
            }
          })
        }
      }
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
      getList(this.currentPage, this.pagesize, this.type, this.name, this.userID).then(response => {
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
      getJobList(-1, -1, 1, '', 1).then(response => {
        this.schoolList = response.data.items
        console.log('schoolList', this.schoolList)
      })
    },
    search() {
      if (this.name.length > 0 && this.userID.length > 0) {
        this.$message('只能同时搜索一项')
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
    resetData() {
      this.listLoading = true
      this.currentPage = 1
      this.name = ''
      this.userID = ''
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
