<template>
  <el-row>
    <el-col :span="10">
      <el-card class="box-card">
        <div>
          <el-row>
            <span>字典名：</span>
            <el-input
              v-model="name"
              placeholder="请输入角色名"
              style="width: 150px;"
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
            highlight-current-row
            @current-change="tableCurrentChange"
          >
            <el-table-column
              type="selection"
              width="50"
            />
            <el-table-column
              prop="name"
              label="字典名"
            />
            <el-table-column
              prop="description"
              label="描述"
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
              layout="total, sizes, prev, pager, next"
              :total="tableData.length"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-row>
        </div>
      </el-card>
    </el-col>
    <el-col :span="14">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-col :span="12"><span>字典详情</span></el-col>
        </div>
        <div>
          <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-bottom: 10px">添加</el-button>
          <el-table
            :data="dictData.slice(0,row)"
            style="width: 100%"
            row-key="id"
            border
            lazy
            :load="load"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column
              prop="name"
              label="所属字典"
            />
            <el-table-column
              prop="label"
              label="标签名"
            />
            <el-table-column
              prop="value"
              label="标签值"
            />
            <el-table-column
              prop="order"
              label="排序"
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
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      tableData: [{
        id: 1,
        name: '字段',
        description: '描述'
      }, {
        id: 2,
        name: '字段',
        description: '描述'
      }, {
        id: 3,
        name: '字段',
        description: '描述'
      }, {
        id: 4,
        name: '字段',
        description: '描述'
      }, {
        id: 5,
        name: '字段',
        description: '描述'
      }, {
        id: 6,
        name: '字段',
        description: '描述'
      }, {
        id: 7,
        name: '字段',
        description: '描述'
      }],
      dictData: [{
        id: 1,
        name: '字段',
        label: 'A',
        value: 'a',
        order: '1'
      }, {
        id: 2,
        name: '字段',
        label: 'B',
        value: 'b',
        order: '2'
      }, {
        id: 3,
        name: '字段',
        label: 'C',
        value: 'c',
        order: '3'
      }],
      row: 5
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      console.log(this.pagesize)
      this.pagesize = val
    },
    tableCurrentChange(val) {
      console.log(`第 ${val.id} 条`)
      this.row = val.id
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
