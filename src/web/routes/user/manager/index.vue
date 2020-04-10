<template>
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
        <el-button type="primary" style="margin-left: 10px">查询</el-button>
        <el-button>重置</el-button>
      </el-row>
      <el-row>
        <el-button type="primary" size="small" icon="el-icon-plus">添加</el-button>
        <el-button size="small">批量操作</el-button>
      </el-row>
    </div>
    <div>
      <el-table
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        style="width: 100%"
        row-key="id"
        border
        lazy
        :load="load"
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
        />
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
          label="部门/院系"
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
          :total="tableData.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </div>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      account: '',
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      tableData: [{
        id: 1,
        name: '王小猫',
        account: 'administrator',
        roles: ['管理员', '/', '用户'],
        datapermission: '全部',
        school: '123',
        department: '321',
        phone: '13122223333'
      }, {
        id: 2,
        name: '王小猫',
        account: 'administrator',
        roles: [1, 2],
        datapermission: '全部',
        school: '123',
        department: '321',
        phone: '13122223333'
      }, {
        id: 3,
        name: '王小猫',
        account: 'administrator',
        roles: [1, 2],
        datapermission: '全部',
        school: '123',
        department: '321',
        phone: '13122223333'
      }, {
        id: 4,
        name: '王小猫',
        account: 'administrator',
        roles: [1, 2],
        datapermission: '全部',
        school: '123',
        department: '321',
        phone: '13122223333'
      }, {
        id: 5,
        name: '王小猫',
        account: 'administrator',
        roles: [1, 2],
        datapermission: '全部',
        school: '123',
        department: '321',
        phone: '13122223333'
      }, {
        id: 6,
        name: '王小猫',
        account: 'administrator',
        roles: [1, 2],
        datapermission: '全部',
        school: '123',
        department: '321',
        phone: '13122223333'
      }, {
        id: 7,
        name: '王小猫',
        account: 'administrator',
        roles: [1, 2],
        datapermission: '全部',
        school: '123',
        department: '321',
        phone: '13122223333'
      }, {
        id: 8,
        name: '王小猫',
        account: 'administrator',
        roles: [1, 2],
        datapermission: '全部',
        school: '123',
        department: '321',
        phone: '13122223333'
      }, {
        id: 9,
        name: '王小猫',
        account: 'administrator',
        roles: [1, 2],
        datapermission: '全部',
        school: '123',
        department: '321',
        phone: '13122223333'
      }, {
        id: 10,
        name: '王小猫',
        account: 'administrator',
        roles: [1, 2],
        datapermission: '全部',
        school: '123',
        department: '321',
        phone: '13122223333'
      }]
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      console.log(this.pagesize)
      this.pagesize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      console.log(this.currentPage)
      this.currentPage = val
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    load(tree, treeNode, resolve) {
      console.log('参数', tree.id)
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }
        ])
      }, 1000)
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
