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
          <el-button type="primary" size="small" icon="el-icon-plus">添加</el-button>
          <el-button size="small">批量操作</el-button>
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
              <span>{{ scope.row.roles.join(' ') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="datapermission"
            label="数据权限"
          />
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
      title="编辑信息"
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
            <el-input v-model="form.address" placeholder="请输入帐号" clearable />
          </el-form-item>
          <el-form-item label="角色" prop="account">
            <el-input v-model="form.address" placeholder="请输入帐号" clearable />
          </el-form-item>
          <el-form-item label="数据权限" prop="account">
            <el-input v-model="form.address" placeholder="请输入帐号" clearable />
          </el-form-item>
          <el-form-item label="学校/单位" prop="account">
            <el-input v-model="form.address" placeholder="请输入帐号" clearable />
          </el-form-item>
          <el-form-item label="院系/部门" prop="account">
            <el-input v-model="form.address" placeholder="请输入帐号" clearable />
          </el-form-item>
          <el-form-item label="联系电话" prop="account">
            <el-input v-model="form.address" placeholder="请输入帐号" clearable />
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getList, updateList, addItem, deleteItem } from '@/web/api/userinfo'
export default {
  data() {
    return {
      visible: false,
      account: '',
      type: 1,
      total: 0,
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      listLoading: true,
      tableData: [],
      form: {
        id: 0,
        name: '',
        userID: '',
        account: '',
        roles: '',
        gender: '',
        datapermission: '',
        school: '',
        department: '',
        phone: '',
        type: 3
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.currentPage, this.pagesize, this.type, this.name, this.account).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        console.log('search', this.tableData, this.total)
        this.listLoading = false
      })
    },
    closeForm() {
      this.visible = false
      this.form = {
        id: 0,
        name: '',
        userID: '',
        account: '',
        roles: '',
        gender: '',
        datapermission: '',
        school: '',
        department: '',
        phone: '',
        type: 3
      }
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
      this.account = ''
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
    handleEdit(index, row) {
      console.log(index, row)
      this.visible = true
    },
    handleDelete(index, row) {
      console.log(index, row)
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
    ma
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
