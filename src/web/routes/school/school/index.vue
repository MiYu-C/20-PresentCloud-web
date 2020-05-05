<template>
  <el-row>
    <el-col :span="24">
      <el-card class="box-card">
        <div>
          <el-row>
            <span>学校名：</span>
            <el-input
              v-model="name"
              placeholder="请输入学校名"
              style="width: 150px;"
            />
            <el-button type="primary" style="margin-left: 10px" @click="handlesearch">查询</el-button>
            <el-button @click="resetData">重置</el-button>
          </el-row>
          <el-row>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="handleadd">添加</el-button>
            <el-button @click="setCurrent()">取消选择</el-button>
          </el-row>
        </div>
        <div>
          <el-table
            ref="table"
            v-loading="listLoading"
            :data="tableData"
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
              label="名称"
            />
            <el-table-column
              prop="level"
              label="级别"
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
          <el-row>
            <el-pagination
              background
              :current-page="currentPage"
              :page-sizes="pagesizes"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-row>
        </div>
      </el-card>
    </el-col>
    <el-dialog
      title="编辑信息"
      :visible.sync="visible1"
      width="50%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="22">
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" clearable />
          </el-form-item>
          <el-form-item label="级别" prop="name">
            <el-input v-model="form.level" placeholder="请输入级别" clearable />
          </el-form-item>
          <el-form-item label="地址" prop="name">
            <el-input v-model="form.address" placeholder="请输入地址" clearable />
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑信息"
      :visible.sync="visible2"
      width="50%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="22">
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" clearable />
          </el-form-item>
          <el-form-item label="级别" prop="name">
            <el-input v-model="form.level" :disabled="true" placeholder="请输入级别" clearable />
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
      :visible.sync="visible3"
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
  </el-row>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getList, updateList, addItem, deleteItem } from '@/web/api/school'
export default {
  data() {
    return {
      visible1: false,
      visible2: false,
      visible3: false,
      newItem: 0,
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      listLoading: true,
      tableData: [],
      childrenData: [],
      total: 0,
      levle: ['', '本科', '学院', '专业'],
      form: {
        id: 0,
        name: '',
        level: '',
        hasChildren: false,
        type: 1,
        childrenType: 2,
        fatherId: 0,
        address: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      row: {
        id: 0,
        name: '',
        level: '',
        hasChildren: false,
        type: 0,
        childrenType: 1,
        fatherId: 0,
        address: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.currentPage, this.pagesize, 1, this.name, 0).then(response => {
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      console.log(this.pagesize)
      this.pagesize = val
      this.fetchData()
    },
    tableCurrentChange(val) {
      console.log(`第 ${val.id} 条`)
      this.row = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      console.log(this.currentPage)
      this.currentPage = val
      this.fetchData()
    },
    handleadd() {
      this.form = {
        id: 0,
        name: '',
        level: this.levle[this.row.childrenType],
        hasChildren: false,
        type: this.row.childrenType,
        childrenType: this.row.childrenType + 1,
        fatherId: this.row.id,
        address: ''
      }
      console.log('type', this.row.type)
      if (this.row.type === 0) {
        this.visible1 = true
      } else {
        if (this.row.type === 3) {
          this.form.childrenType = 3
          this.form.fatherId = this.row.fatherId
        }
        this.visible2 = true
      }
    },
    handlesearch() {
      this.listLoading = true
      this.currentPage = 1
      console.log('search', this.name.length, this.currentPage)
      this.fetchData()
    },
    handleEdit(index, row) {
      console.log(index, row.type)
      this.form = JSON.parse(JSON.stringify(row))
      if (row.type === 1) {
        this.visible1 = true
      } else {
        this.visible2 = true
      }
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.visible3 = true
    },
    grtChildren(type, ID) {
      getList(this.currentPage, this.pagesize, type, '', ID).then(response => {
        console.log('grtChildren', response.data.items)
        this.childrenData = response.data.items
      })
    },
    refreshRow(type, ID) {
      getList(this.currentPage, this.pagesize, type, '', ID).then(response => {
        console.log('refreshRow', type, ID, response.data.items)
        this.$set(this.$refs.table.store.states.lazyTreeNodeMap, ID, response.data.items)
      })
    },
    update() {
      console.log('form', this.form.id, this.form.type, this.form.fatherId)
      this.listLoading = true
      if (this.form.id === 0) {
        addItem(this.form).then(response => {
          console.log('add', response.data)
          this.newItem = response.data
          console.log('newItem1', response.data)
        })
      } else {
        updateList(this.form).then(response => {
          console.log('update', response.data)
        })
      }
      if (this.form.type !== 1) {
        console.log('form', this.form.type, this.form.fatherId)
        this.refreshRow(this.form.type, this.form.fatherId)
      }
      this.closeForm()
      this.fetchData()
    },
    delete1() {
      deleteItem(this.form).then(response => {
        console.log('delete', response.data, (this.currentPage - 1) * this.pagesize)
        this.total = response.data
      })
      if (this.form.type !== '1') {
        console.log('form', this.form.type, this.form.fatherId)
        this.refreshRow(this.form.type, this.form.fatherId)
      }
      this.closeForm()
      this.fetchData()
    },
    setCurrent() {
      const row = {
        id: 0,
        name: '',
        level: '',
        hasChildren: false,
        type: 0,
        childrenType: 1,
        fatherId: 0,
        address: ''
      }
      this.$refs.table.setCurrentRow(row)
    },
    closeForm() {
      this.visible1 = false
      this.visible2 = false
      this.visible3 = false
      this.form = {
        id: 0,
        name: '',
        level: '',
        hasChildren: false,
        type: 1,
        childrenType: 2,
        fatherId: 0,
        address: ''
      }
      this.row = {
        id: 0,
        name: '',
        level: '',
        hasChildren: false,
        type: 0,
        childrenType: 1,
        fatherId: 0,
        address: ''
      }
    },
    resetData() {
      this.listLoading = true
      this.currentPage = 1
      this.name = ''
      this.fetchData()
    },
    load(tree, treeNode, resolve) {
      console.log('参数', tree.childrenType, tree.id)
      this.grtChildren(tree.childrenType, tree.id)
      setTimeout(() => {
        console.log('childrenData', this.childrenData)
        resolve(this.childrenData)
      }, 1000)
      this.childrenData = []
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
