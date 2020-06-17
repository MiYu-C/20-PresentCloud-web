<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div>
            <el-row>
              <span>字典名：</span>
              <el-input
                v-model="name"
                placeholder="请输入字典名"
                style="width: 150px;"
                @keyup.enter.native="search"
              />
              <el-button type="primary" style="margin-left: 10px" @click="search">查询</el-button>
              <el-button @click="resetData">重置</el-button>
            </el-row>
            <el-row>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            </el-row>
          </div>
          <div>
            <el-table
              v-loading="tableLoading"
              :data="tableData"
              style="width: 100%"
              row-key="id"
              border
              lazy
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
            <el-col :span="12"><span>字典详情</span></el-col>
          </div>
          <div>
            <el-table
              ref="singleTable"
              v-loading="labelLoading"
              :data="lableData"
              style="width: 100%"
              row-key="id"
              border
              lazy
              :default-sort="{prop: 'order', order: 'ascending'}"
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
                sortable
              />
              <el-table-column
                prop="isdefault"
                label="是否默认"
              >
                <template slot-scope="scope">
                  <el-tag :type="scope.row.isdefault.toString() === 'true' ? 'success' : 'danger'">{{ scope.row.isdefault.toString() === 'true' ? '是' : '否' }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="确认删除"
      :visible.sync="deleteVisible"
      width="30%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="22">
        <span>确认删除选中项？</span>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteData">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑字典"
      :visible.sync="visible"
      width="60%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="23">
        <el-form ref="form" :model="form" label-width="80px" label-position="top">
          <el-form-item label="数据字典" prop="name">
            <div>
              字典名：
              <el-input v-model="form.name" style="width: 200px;" placeholder="请输入字典名" clearable />
              描述：
              <el-input v-model="form.description" style="width: 350px;" placeholder="请输入描述" clearable />
            </div>
          </el-form-item>
          <el-form-item label="字典详情">
            <el-table
              ref="lableList"
              v-loading="formLoading"
              :data.sync="formlableData"
              style="width: 100%"
              row-key="id"
              border
              lazy
              :default-sort="{prop: 'order', order: 'ascending'}"
            >
              <el-table-column
                prop="name"
                label="所属字典"
                width="100"
              />
              <el-table-column
                prop="label"
                label="标签名"
              >
                <template slot-scope="scope">
                  <span v-show="!scope.row.inputShow">{{ scope.row.label }}</span>
                  <el-input v-show="scope.row.inputShow" v-model="scope.row.label" class="table-input" placeholder="请输入标签名" />
                </template>
              </el-table-column>
              <el-table-column
                prop="value"
                label="标签值"
              />
              <el-table-column
                prop="order"
                label="排序"
                sortable
              />
              <el-table-column
                prop="isdefault"
                label="是否默认"
                width="100"
              >
                <template slot-scope="scope">
                  <el-tag :type="scope.row.isdefault.toString() === 'true' ? 'success' : 'danger'">{{ scope.row.isdefault.toString() === 'true' ? '是' : '否' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleLabelEdit(scope.$index, scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleLabelDelete(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="handleLabelAdd">添加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update()">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑字典详情"
      :visible.sync="visibleLabel"
      width="40%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="23">
        <el-form ref="labelForm" :model="labelForm" label-width="80px">
          <el-form-item label="所属字典">
            <el-input v-model="labelForm.name" placeholder="请输入字典名" clearable :disabled="true" />
          </el-form-item>
          <el-form-item label="标签名" prop="label">
            <el-input v-model="labelForm.label" placeholder="请输入标签名" clearable />
          </el-form-item>
          <el-form-item label="标签值" prop="value">
            <el-input v-model="labelForm.value" placeholder="请输入标签值" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="order">
            <el-input-number v-model="labelForm.order" :min="1" :max="999" clearable />
          </el-form-item>
          <el-form-item label="是否默认">
            <el-switch
              v-model="labelForm.isdefault"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatelableData()">确 定</el-button>
        <el-button @click="visibleLabel = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { getList, addItem, getLabel, updateList, deleteItem } from '@/web/api/dictionary'

export default {
  data() {
    return {
      total: 0,
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      tableLoading: true,
      labelLoading: false,
      formLoading: false,
      visible: false,
      visibleLabel: false,
      deleteVisible: false,
      tableData: [],
      lableData: [],
      formlableData: [],
      defaultForm: {
        id: 0,
        name: '',
        description: ''
      },
      defaultlabelForm: {
        id: 0,
        name: '',
        label: '',
        value: '',
        order: 0,
        isdefault: false
      },
      form: null,
      labelForm: null,
      row: null
    }
  },
  created() {
    this.fetchData()
    this.form = JSON.parse(JSON.stringify(this.defaultForm))
    this.row = JSON.parse(JSON.stringify(this.defaultForm))
    this.labelForm = JSON.parse(JSON.stringify(this.defaultlabelForm))
  },
  methods: {
    fetchData() {
      this.tableLoading = true
      getList(this.currentPage, this.pagesize, this.name).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        console.log('search', this.tableData, this.total)
        if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
          this.currentPage -= 1
          this.fetchData()
        }
        this.tableLoading = false
      })
    },
    search() {
      if (this.name.length === 0) {
        this.$message('不能为空')
      } else {
        this.tableLoading = true
        this.currentPage = 1
        console.log('search', this.name.length, this.currentPage)
        this.fetchData()
      }
    },
    resetData() {
      this.tableLoading = true
      this.currentPage = 1
      this.name = ''
      this.fetchData()
    },
    tableCurrentChange(val) {
      console.log(`第 ${val.id} 条`)
      this.row = val
      this.labelLoading = true
      getLabel(this.row.id).then(response => {
        this.lableData = response.data.items
        console.log('lableData', this.lableData)
        this.labelLoading = false
      })
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
    handleAdd() {
      console.log('defaultForm', this.defaultForm)
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.formlableData = []
      console.log('form', this.form)
      this.visible = true
    },
    handleLabelAdd() {
      console.log('defaultlabelForm', this.defaultlabelForm)
      this.labelForm = JSON.parse(JSON.stringify(this.defaultlabelForm))
      this.labelForm.name = this.form.name
      console.log('labelForm', this.labelForm)
      this.visibleLabel = true
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑字典'
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.formLoading = true
      getLabel(this.form.id).then(response => {
        this.formlableData = response.data.items
        console.log('formlableData', this.formlableData)
        this.formLoading = false
      })
      this.visible = true
    },
    handleLabelEdit(index, row) {
      this.dialogTitle = '编辑字典详情'
      console.log(index, row)
      this.labelForm = JSON.parse(JSON.stringify(row))
      this.visibleLabel = true
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.deleteVisible = true
    },
    handleLabelDelete(index, row) {
      console.log(index, row)
      this.labelForm = JSON.parse(JSON.stringify(row))
      this.formlableData = this.formlableData.filter(item => item.id !== this.labelForm.id)
    },
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('验证成功!')
          console.log('form', this.form)
          this.listLoading = true
          if (this.form.id === 0) {
            addItem(this.form, this.formlableData).then(response => {
              console.log('add', response.data)
              this.newItem = response.data
              console.log('afterAdd', response.data)
              this.tableCurrentChange(this.form)
              this.closeForm()
              this.fetchData()
            })
          } else {
            updateList(this.form, this.formlableData).then(response => {
              console.log('update', response.data)
              this.tableCurrentChange(this.form)
              this.closeForm()
              this.fetchData()
            })
          }
        }
      })
    },
    updatelableData() {
      this.$refs['labelForm'].validate((valid) => {
        if (valid) {
          this.formLoading = true
          if (this.labelForm.id.toString() === '0') {
            let id = this.getRandomInt(10, 100)
            while (this.formlableData.findIndex(item => item.id.toString() === id.toString()) > -1) {
              id = this.getRandomInt(10, 100)
            }
            this.labelForm.id = id
            this.formlableData.push(this.labelForm)
          } else {
            const index = this.formlableData.findIndex(item => item.id.toString() === this.labelForm.id.toString())
            // this.formlableData[index] = JSON.parse(JSON.stringify(this.labelForm))
            this.$set(this.formlableData, index, this.labelForm)
          }
          this.visibleLabel = false
          this.formLoading = false
        }
      })
    },
    deleteData() {
      deleteItem(this.form).then(response => {
        console.log('delete', response.data)
        this.total = response.data
      })
      this.closeForm()
      this.fetchData()
    },
    closeForm() {
      this.visible = false
      this.deleteVisible = false
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
    },
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
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
    &:last-child {
    margin-bottom: 0;
    }
}
.row-bg {
    margin: 15px;
    padding: 10px 0;
    background-color: #f9fafc;
}
.table-input {
    width: 50;
}
</style>
