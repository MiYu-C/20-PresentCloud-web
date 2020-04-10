<template>
  <el-card class="box-card">
    <div>
      <el-row>
        <span>菜单名：</span>
        <el-input
          v-model="name"
          placeholder="请输入帐号"
          style="width: 200px;"
        />
        <span>日期：</span>
        <el-date-picker
          v-model="time"
          type="date"
          placeholder="请选择时间"
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
          label="菜单名称"
        />
        <el-table-column
          prop="icon"
          label="图标"
          width="120"
        />
        <el-table-column
          prop="order"
          label="排序"
        />
        <el-table-column
          prop="type"
          label="类别"
        />
        <el-table-column
          prop="router"
          label="路由地址"
        />
        <el-table-column
          prop="competence"
          label="权限"
        />
        <el-table-column
          prop="isView"
          label="是否可见"
        />
        <el-table-column
          prop="famenu"
          label="上级菜单"
        />
        <el-table-column
          prop="createtime"
          label="创建时间"
          width="140"
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
      time: '',
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      tableData: [{
        id: 1,
        name: '首页',
        icon: 'administrator',
        order: '123',
        type: '全部',
        router: '123',
        competence: '321',
        isView: '是',
        famenu: '无',
        createtime: '2019-12-12 13:22'
      }, {
        id: 2,
        name: '首页',
        icon: 'administrator',
        order: '123',
        type: '全部',
        router: '123',
        competence: '321',
        isView: '是',
        famenu: '无',
        createtime: '2019-12-12 13:22'
      }, {
        id: 3,
        name: '首页',
        icon: 'administrator',
        order: '123',
        type: '全部',
        router: '123',
        competence: '321',
        isView: '是',
        famenu: '无',
        createtime: '2019-12-12 13:22'
      }, {
        id: 4,
        name: '首页',
        icon: 'administrator',
        order: '123',
        type: '全部',
        router: '123',
        competence: '321',
        isView: '是',
        famenu: '无',
        createtime: '2019-12-12 13:22'
      }, {
        id: 5,
        name: '首页',
        icon: 'administrator',
        order: '123',
        type: '全部',
        router: '123',
        competence: '321',
        isView: '是',
        famenu: '无',
        createtime: '2019-12-12 13:22'
      }, {
        id: 6,
        name: '首页',
        icon: 'administrator',
        order: '123',
        type: '全部',
        router: '123',
        competence: '321',
        isView: '是',
        famenu: '无',
        createtime: '2019-12-12 13:22'
      }, {
        id: 7,
        name: '首页',
        icon: 'administrator',
        order: '123',
        type: '全部',
        router: '123',
        competence: '321',
        isView: '是',
        famenu: '无',
        createtime: '2019-12-12 13:22'
      }, {
        name: '首页',
        icon: 'administrator',
        order: '123',
        type: '全部',
        router: '123',
        competence: '321',
        isView: '是',
        famenu: '无',
        createtime: '2019-12-12 13:22'
      }, {
        id: 9,
        name: '首页',
        icon: 'administrator',
        order: '123',
        type: '全部',
        router: '123',
        competence: '321',
        isView: '是',
        famenu: '无',
        createtime: '2019-12-12 13:22'
      }, {
        id: 10,
        name: '首页',
        icon: 'administrator',
        order: '123',
        type: '全部',
        router: '123',
        competence: '321',
        isView: '是',
        famenu: '无',
        createtime: '2019-12-12 13:22'
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
