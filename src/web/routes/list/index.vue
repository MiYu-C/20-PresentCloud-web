<template>
  <div>
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
          highlight-current-row
          :default-sort="{prop: 'date', order: 'ascending'}"
          :load="load"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="date"
            label="日期"
            width="180"
            sortable
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
        <Pagination :message="tableData.length" :type="type" @func="getMsg" />
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
        <el-form ref="form" :model="form" :rules="rules" label-position="right">
          <el-form-item label="日期" prop="date">
            <el-input v-model="form.date" placeholder="请输入日期" clearable />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入地址" clearable />
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
import Pagination from '@/components/Pagination/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      visible: false,
      type: 0,
      pagesize: 5,
      currentPage: 1,
      currentRow: null,
      form: {
        id: '',
        date: '',
        name: '',
        address: ''
      },
      index: 0,
      rules: {
        user: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
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
        address: '上海市普陀区金沙江路 1519 弄'
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
      }, {
        id: 7,
        date: '2016-05-03',
        name: '王小龙',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        id: 8,
        date: '2016-05-03',
        name: '王小龙',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        id: 9,
        date: '2016-05-03',
        name: '王小龙',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        id: 10,
        date: '2016-05-03',
        name: '王小龙',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        id: 11,
        date: '2016-05-03',
        name: '王小龙',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        id: 12,
        date: '2016-05-03',
        name: '王小龙',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        id: 13,
        date: '2016-05-03',
        name: '王小龙',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    closeForm() {
      this.visible = false
    },
    update() {
      console.log(this.form.index)
      this.index = this.form.index
      delete this.form.index
      console.log(this.form.index)
      this.$set(this.tableData, this.index, this.form)
      this.visible = false
    },
    handleEdit(index, row) {
      this.visible = true
      console.log(index)
      index = this.tableData.findIndex(item => item.id === row.id)
      console.log(index)
      this.form = JSON.parse(JSON.stringify(row))
      this.$set(this.form, 'index', index)
      console.log('A', this.tableData[index].name)
      // this.tableData[index] = row
      // console.log('B', this.tableData[index].name)
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.tableData.splice(index, 1)
      console.log(this.tableData.length)
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
    },
    handleCurrentChange(val) {
      console.log(this.tableData[0].name)
      console.log(this.tableData[1].name)
      this.currentRow = val
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
