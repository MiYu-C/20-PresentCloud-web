<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>标准列表</span>
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
          prop="date"
          label="日期"
          width="180"
        />
        <el-table-column
          prop="name"
          label="姓名"
          width="180"
        />
        <el-table-column
          prop="address"
          label="地址"
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
      <Pagination :message="tableData.length" @func="getMsg" />
    </div>
  </el-card>
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      pagesize: 5,
      currentPage: 1,
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小猫',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小牛',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        hasChildren: true
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小龙',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        id: 5,
        date: '2016-05-03',
        name: '王小龙',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        id: 6,
        date: '2016-05-03',
        name: '王小龙',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
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
    },
    getMsg(data) {
      this.pagesize = data[0]
      this.currentPage = data[1]
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
    margin: 15px;
    width: 95%;
}
</style>
