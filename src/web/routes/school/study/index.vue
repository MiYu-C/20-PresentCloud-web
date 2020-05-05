<template>
  <el-row>
    <el-col :span="12">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-col :span="12"><span>学习行为设置</span></el-col>
        </div>
        <div>
          <el-row>
            <el-input
              v-model="name"
              placeholder="请输入"
              style="width: 250px;"
              size="small"
            />
            <el-button type="primary" size="small" style="margin-left: 10px">查询</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus">添加</el-button>
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
              prop="behaviorname"
              label="学习行为"
            />
            <el-table-column
              prop="score"
              label="默认分数"
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
              layout="total, prev, pager, next, sizes"
              :total="tableData.length"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-row>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-col :span="12"><span>出勤设置</span></el-col>
        </div>
        <div>
          <el-row>
            <el-input
              v-model="name"
              placeholder="请输入"
              style="width: 250px;"
              size="small"
            />
            <el-button type="primary" size="small" style="margin-left: 10px">查询</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus">添加</el-button>
          </el-row>
          <el-table
            :data="dictData"
            style="width: 100%"
            row-key="id"
            border
            lazy
            :load="load"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column
              prop="attenrate"
              label="出勤率"
            />
            <el-table-column
              prop="attenlevel"
              label="出勤等级"
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
        behaviorname: '行为',
        score: '2'
      }, {
        id: 2,
        behaviorname: '行为',
        score: '2'
      }, {
        id: 3,
        behaviorname: '行为',
        score: '2'
      }, {
        id: 4,
        behaviorname: '行为',
        score: '2'
      }, {
        id: 5,
        behaviorname: '行为',
        score: '2'
      }, {
        id: 6,
        behaviorname: '行为',
        score: '2'
      }, {
        id: 7,
        behaviorname: '行为',
        score: '2'
      }],
      dictData: [{
        id: 1,
        attenrate: '75~100%',
        attenlevel: '1'
      }, {
        id: 2,
        attenrate: '50~75%',
        attenlevel: '2'
      }, {
        id: 3,
        attenrate: '25~50%',
        attenlevel: '3'
      }, {
        id: 4,
        attenrate: '0~25%',
        attenlevel: '4'
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
}
.row-bg {
    margin: 15px;
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
