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
        />
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
  </el-card>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getList, updateList, addItem, deleteItem } from '@/web/api/userinfo'
export default {
  data() {
    return {
      userID: '',
      type: 2,
      total: 0,
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      listLoading: true,
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.currentPage, this.pagesize, this.type, this.name, this.userID).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        console.log('search', this.tableData, this.total)
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
    handleEdit(index, row) {
      console.log(index, row)
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
