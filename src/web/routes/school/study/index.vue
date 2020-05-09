<template>
  <div>
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
              <el-button type="primary" size="small" style="margin-left: 10px" @click="handlesearch">查询</el-button>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="handleadd">添加</el-button>
            </el-row>
          </div>
          <div>
            <el-table
              :data="tableData"
              style="width: 100%"
              row-key="id"
              border
              @current-change="tableCurrentChange"
            >
              <el-table-column
                prop="name"
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
                :total="total"
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
    <el-dialog
      titel="编辑学习行为"
      :visible.sync="visible1"
      width="30%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col>
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="100px">
          <el-form-item label="学习行为" prop="name">
            <el-input v-model="form.name" placeholder="请输入行为" clearable />
          </el-form-item>
          <el-form-item label="默认经验值" prop="score">
            <el-input v-model="form.score" placeholder="请输入经验值" clearable />
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
import { getList, updateList, addItem, deleteItem } from '@/web/api/study'
export default {
  data() {
    return {
      visible1: false,
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      total: 0,
      index: 0,
      tableData: [{
        id: '',
        name: '',
        score: ''
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
      form: {
        id: '',
        name: '',
        score: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.currentPage, this.pagesize, this.name).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        if ((this.currentPage - 1) * this.pagesize >= response.data.total && this.currentPage > 1) {
          this.currentPage -= 1
          this.fetchData()
        }
        if (this.newItem > 0) {
          this.currentPage = Math.floor(this.total / this.pagesize) + 1
          this.newItem = 0
          console.log('newItem2', this.currentPage)
          this.fetchData()
        }
        console.log('search', this.tableData, this.total)
        this.listLoading = false
      })
    },
    handlesearch() {
      console.log('search', this.name.length, this.currentPage)
      this.fetchData()
    },
    handleadd() {
      this.visible1 = true
    },
    closeForm() {
      this.visible1 = false
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      console.log(this.pagesize)
      this.pagesize = val
      this.fetchData()
    },
    tableCurrentChange(val) {
      console.log(`第 ${val.id} 条`)
      this.row = val.id
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      console.log(this.currentPage)
      this.currentPage = val
      this.fetchData()
    },
    handleEdit(index, row) {
      this.visible1 = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleDelete(index, row) {
      console.log(index, row)
      row = JSON.parse(JSON.stringify(row))
      deleteItem(row).then(response => {
        console.log('delete', response.data, (this.currentPage - 1) * this.pagesize)
        this.total = response.data
      })
      console.log('delete', row.id, this.currentPage)
      this.fetchData()
    },
    update() {
      console.log('form', this.form)
      this.listLoading = true
      updateList(this.form).then(response => {
        console.log('update', response.data)
      })
      this.form.id = this.total + 1
      addItem(this.form).then(response => {
        console.log('add', response.data)
        this.newItem = response.data
        console.log('newItem1', response.data)
      })
      // this.index = this.form.index
      // delete this.form.index
      // console.log(this.form.index)
      // this.$set(this.tableData, this.index, this.form)
      this.closeForm()
      this.fetchData()
    }
  //   load(tree, treeNode, resolve) {
  //     console.log('参数', tree.id)
  //     setTimeout(() => {
  //       resolve([
  //         {
  //           id: 31,
  //           date: '2016-05-01',
  //           name: '王小虎',
  //           address: '上海市普陀区金沙江路 1519 弄'
  //         }, {
  //           id: 32,
  //           date: '2016-05-01',
  //           name: '王小虎',
  //           address: '上海市普陀区金沙江路 1519 弄'
  //         }
  //       ])
  //     }, 1000)
  //   }
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
