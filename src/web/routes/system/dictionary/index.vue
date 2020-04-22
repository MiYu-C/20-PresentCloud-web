<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div>
            <el-row>
              <span>字典名：</span>
              <el-input
                v-model="inputSearch"
                placeholder="请输入字典名"
                style="width: 150px;"
              />
              <el-button type="primary" style="margin-left: 10px" @click="searchDict">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-row>
            <el-row>
              <el-button type="primary" size="small" icon="el-icon-plus">添加</el-button>
              <el-button size="small">批量操作</el-button>
            </el-row>
          </div>
          <div>
            <el-table
              :data="tables.slice((currentPage-1)*pagesize,currentPage*pagesize)"
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
                    @click="handleEdit(scope.$index, scope.row, 1)"
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
                :total="tables.length"
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
            <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-bottom: 10px">添加</el-button>
            <el-table
              ref="singleTable"
              :data="dicts"
              style="width: 100%"
              row-key="id"
              border
              lazy
              highlight-current-row
              :load="load"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              @current-change="setCurrentRow"
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
                    @click="handleEdit(scope.$index, scope.row, 2)"
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
      title="编辑字典"
      :visible.sync="visible1"
      width="50%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="22">
        <el-form :model="form" :rules="rules" label-position="right">
          <el-form-item label="字典名" prop="name">
            <el-input v-model="form.name" placeholder="请输入字典名" clearable />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入描述" clearable />
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update(1)">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑字典详情"
      :visible.sync="visible2"
      width="50%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="22">
        <el-form :model="dictForm" :rules="rules" label-position="right">
          <el-form-item label="所属字典" prop="name">
            <el-input v-model="dictForm.name" placeholder="请输入字典名" clearable />
          </el-form-item>
          <el-form-item label="标签名" prop="label">
            <el-input v-model="dictForm.label" placeholder="请输入标签名" clearable />
          </el-form-item>
          <el-form-item label="标签值" prop="value">
            <el-input v-model="dictForm.value" placeholder="请输入标签值" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="order">
            <el-input v-model="dictForm.order" placeholder="请输入排序" clearable />
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update(2)">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible1: false,
      visible2: false,
      name: '',
      inputSearch: '',
      search: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      form: {
        id: '',
        name: '',
        description: '',
        default: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      tableData: [{
        id: 1,
        name: '学校',
        description: '描述',
        default: 1
      }, {
        id: 2,
        name: '用户类型',
        description: '描述',
        default: 1
      }, {
        id: 3,
        name: '角色类型',
        description: '描述',
        default: 1
      }, {
        id: 4,
        name: '菜单类型',
        description: '描述',
        default: 1
      }, {
        id: 5,
        name: '性别',
        description: '描述',
        default: 2
      }, {
        id: 6,
        name: '学院',
        description: '描述',
        default: 1
      }, {
        id: 7,
        name: '数据权限',
        description: '描述',
        default: 1
      }],
      dictForm: {
        id: '',
        name: '',
        label: '',
        value: '',
        order: ''
      },
      dictData: [{
        id: 1,
        name: '学校',
        label: '福州大学',
        value: '1',
        order: '1'
      }, {
        id: 2,
        name: '学校',
        label: '无',
        value: '0',
        order: '2'
      }, {
        id: 3,
        name: '性别',
        label: '男',
        value: '1',
        order: '1'
      }, {
        id: 4,
        name: '用户类型',
        label: '学生',
        value: '1',
        order: '1'
      }, {
        id: 5,
        name: '用户类型',
        label: '教师',
        value: '2',
        order: '2'
      }, {
        id: 6,
        name: '性别',
        label: '女',
        value: '2',
        order: '2'
      }, {
        id: 7,
        name: '性别',
        label: '未知',
        value: '0',
        order: '3'
      }],
      row: 'null',
      default: 0
    }
  },
  computed: {
    // 模糊搜索
    tables() {
      const search = this.search
      console.log(search)
      if (search) {
        // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
        // 注意： filter() 不会对空数组进行检测。
        // 注意： filter() 不会改变原始数组。
        return this.tableData.filter(data => {
          // some() 方法用于检测数组中的元素是否满足指定条件;
          // some() 方法会依次执行数组的每个元素：
          // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
          // 如果没有满足条件的元素，则返回false。
          // 注意： some() 不会对空数组进行检测。
          // 注意： some() 不会改变原始数组。
          return Object.keys(data).some(key => {
            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
            // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
            return String(data['name']).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return this.tableData
    },
    // 标签项
    dicts() {
      const row = this.row
      console.log(row)
      if (row) {
        // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
        // 注意： filter() 不会对空数组进行检测。
        // 注意： filter() 不会改变原始数组。
        return this.dictData.filter(data => {
          // some() 方法用于检测数组中的元素是否满足指定条件;
          // some() 方法会依次执行数组的每个元素：
          // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
          // 如果没有满足条件的元素，则返回false。
          // 注意： some() 不会对空数组进行检测。
          // 注意： some() 不会改变原始数组。
          return Object.keys(data).some(key => {
            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
            // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
            return String(data['name']).toLowerCase().indexOf(row) > -1
          })
        })
      }
      return this.dictData
    }
  },
  methods: {
    closeForm() {
      this.visible1 = false
      this.visible2 = false
    },
    update(visible) {
      if (visible === 1) {
        console.log(this.form.index)
        this.index = this.form.index
        delete this.form.index
        console.log(this.form.index)
        this.$set(this.tableData, this.index, this.form)
      } else {
        console.log(this.dictForm.index)
        this.index = this.dictForm.index
        delete this.dictForm.index
        console.log(this.dictForm.index)
        this.$set(this.dictData, this.index, this.dictForm)
      }
      this.visible1 = false
      this.visible2 = false
    },
    setCurrentRow(val) {
      console.log(';')
      this.$refs.singleTable.setCurrentRow(this.dicts[this.default])
    },
    searchDict() {
      this.search = this.inputSearch
    },
    resetSearch() {
      this.search = ''
      this.inputSearch = ''
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      console.log(this.pagesize)
      this.pagesize = val
    },
    tableCurrentChange(val) {
      console.log(`第 ${val.id} 条`)
      this.row = val.name
      this.default = val.default
      this.$refs.singleTable.setCurrentRow(this.dicts[this.default])
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      console.log(this.currentPage)
      this.currentPage = val
    },
    handleEdit(index, row, visible) {
      console.log(index, row)
      if (visible === 1) {
        this.visible1 = true
        this.form = JSON.parse(JSON.stringify(row))
        this.$set(this.form, 'index', index)
      } else {
        this.visible2 = true
        this.dictForm = JSON.parse(JSON.stringify(row))
        this.$set(this.dictForm, 'index', index)
      }
      console.log(this.visible1, this.visible2)
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
