<template>
  <el-row>
    <el-col :span="16">
      <el-card class="box-card">
        <div>
          <el-row>
            <span>角色名：</span>
            <el-input
              v-model="name"
              placeholder="请输入角色名"
              style="width: 200px;"
            />
            <el-button type="primary" style="margin-left: 10px" @click="handlesearch">查询</el-button>
            <el-button @click="resetData">重置</el-button>
          </el-row>
          <el-row>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="handleadd">添加</el-button>
            <el-button size="small">批量操作</el-button>
          </el-row>
        </div>
        <div>
          <el-table
            ref="table"
            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            style="width: 100%"
            row-key="id"
            highlight-current-row
            @current-change="tableCurrentChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="id"
              label="编号"
              width="80"
            />
            <el-table-column
              prop="name"
              label="角色名"
            />
            <el-table-column
              prop="datapermission"
              label="数据权限"
            />
            <el-table-column
              prop="level"
              label="角色级别"
            />
            <el-table-column
              prop="description"
              label="描述"
              width="200"
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
        <el-dialog
          title="编辑信息"
          :visible.sync="visible"
          width="50%"
          :show-close="false"
          :destroy-on-close="true"
        >
          <el-col :span="22">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="80px">
              <el-form-item label="角色名" prop="name">
                <el-input v-model="form.name" placeholder="请输入角色名" clearable />
              </el-form-item>
              <el-form-item label="角色级别" prop="level" size="mini">
                <el-input-number v-model="form.level" :min="1" :max="999" clearable />
              </el-form-item>
              <el-form-item label="数据权限" prop="datapermission">
                <el-select v-model="form.datapermission" placeholder="请选择">
                  <el-option
                    v-for="item in datapermissions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="描述" prop="description" size="mini">
                <el-input
                  v-model="form.description"
                  type="textarea"
                  autosize
                  placeholder="请输入内容"
                />
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
          :visible.sync="deleteVisible"
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
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
            <span class="role-span">菜单分配</span>
          </el-tooltip>
          <el-button
            icon="el-icon-check"
            size="mini"
            style="float: right; padding: 6px 9px"
            type="primary"
            :disabled="!save"
            @click="saveMenus"
          >保存</el-button>
        </div>
        <el-tree
          ref="tree"
          :data="treeData"
          :props="props"
          show-checkbox
          node-key="id"
          @check-change="handleCheckChange"
        />
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getList, updateList, addItem, deleteItem, isExist } from '@/web/api/role'
import { getList as getMenus } from '@/web/api/menu'
export default {
  data() {
    return {
      name: '',
      visible: false,
      deleteVisible: false,
      save: false,
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      tableData: [],
      treeData: [],
      props: {
        children: 'children',
        label: 'name'
      },
      total: 0,
      datapermissions: ['全部', '本级', '自定义'],
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      defaultForm: {
        id: 0,
        name: '',
        datapermission: '',
        level: 1,
        menus: [],
        description: ''
      },
      form: null,
      row: null,
      menus: []
    }
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.defaultForm))
    this.row = JSON.parse(JSON.stringify(this.defaultForm))
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.currentPage, this.pagesize, this.name).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        console.log('tableData', this.tableData)
        if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
          this.currentPage -= 1
          this.fetchData()
        }
        if (this.newItem > 0) {
          this.currentPage = Math.floor(this.total / this.pagesize) + 1
          this.newItem = 0
          console.log('newItem2', this.currentPage)
          this.fetchData()
        }
        this.setCheckedKeys(this.row.menus)
        this.listLoading = false
      })
      getMenus('', '-1').then(response => {
        const data = response.data.items
        console.log('Data', this.data)
        this.treeData = this.setTreeData(data, 1)
        // this.tableData = this.treeData[0].children
        console.log('treeData', this.treeData)
      })
    },
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
    tableCurrentChange(val) {
      console.log(`第 ${val.id} 条`)
      this.save = true
      this.resetChecked()
      this.row = val
      this.menus = val.menus
      this.setCheckedKeys(this.menus)
    },
    handleadd() {
      console.log('defaultForm', this.defaultForm)
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      console.log('form', this.form)
      this.visible = true
    },
    handleEdit(index, row) {
      this.visible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.deleteVisible = true
    },
    handlesearch() {
      this.listLoading = true
      console.log('search')
      getList(1, this.pagesizes, this.name).then(response => {
        this.tableData = response.data.items
        console.log('search', this.tableData)
        this.listLoading = false
      })
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log('handleCheckChange', data, checked, indeterminate)
      this.getCheckedKeys()
    },
    setCheckedKeys(menus) {
      this.$refs.tree.setCheckedKeys(menus)
    },
    getCheckedKeys() {
      this.menus = this.$refs.tree.getCheckedKeys()
      console.log('menus', this.menus)
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('编辑成功!')
          console.log('form', this.form)
          this.listLoading = true
          if (this.form.id === 0) {
            addItem(this.form).then(response => {
              console.log('add', response.data)
              this.newItem = response.data
              console.log('afterAdd', response.data)
            })
          } else {
            updateList(this.form).then(response => {
              console.log('update', response.data)
            })
          }
          this.closeForm()
          this.fetchData()
        }
      })
    },
    saveMenus() {
      console.log('row', this.row)
      console.log('menus', this.menus)
      this.row.menus = this.menus
      updateList(this.row).then(response => {
        console.log('update', response.data)
      })
      this.fetchData()
    },
    delete1() {
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
    setTreeData(source, id) {
      console.log('source', source)
      const cloneData = JSON.parse(JSON.stringify(source)) // 对源数据深度克隆
      console.log('cloneData', cloneData)
      return cloneData.filter(father => { // 循环所有项，并添加children属性
        const branchArr = cloneData.filter(child => Number(father.id) === Number(child.fatherId)) // 返回每一项的子级数组
        // console.log('branchArr', branchArr)
        branchArr.length > 0 ? father.children = branchArr : father.children = [] // 给父级添加一个children属性，并赋值
        return father.fatherId === id // 返回第一层
      })
    },
    resetData() {
      this.listLoading = true
      this.name = ''
      this.fetchData()
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
