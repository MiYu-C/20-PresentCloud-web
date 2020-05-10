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
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-row>
        </div>
      </el-card>
    </el-col>
    <el-dialog
      :title="dialog"
      :visible.sync="visible1"
      width="30%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="22">
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item v-show="form.type.toString() === '1'" label="级别" prop="level">
            <el-select v-model="form.level" placeholder="请选择级别">
              <el-option
                v-for="item in schoolLevelList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="form.type.toString() === '2'" label="级别" prop="level">
            <el-select v-model="form.level" placeholder="请选择级别">
              <el-option
                v-for="item in collegeLevelList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="form.type.toString() === '3'" label="级别" prop="level">
            <el-select v-model="form.level" placeholder="请选择级别">
              <el-option
                v-for="item in majorLevelList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="form.type.toString() === '3' || form.type.toString() === '2'" label="所属学校">
            <span>{{ fathers[0].name }}</span>
          </el-form-item>
          <el-form-item v-show="form.type.toString() === '3'" label="所属学院">
            <!-- <span>{{ fathers[1].name }}</span> -->
            <template>
              <el-select v-model="college" placeholder="请输入关键词">
                <el-option
                  v-for="item in collegeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item v-show="form.type.toString() === '1'" label="省份" prop="name">
            <el-select v-model="area[0]" placeholder="请选择省份">
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="form.type.toString() === '1'" label="城市" prop="name">
            <el-select v-model="area[1]" :disabled="city" placeholder="请选择城市">
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog
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
          <el-form-item label="级别" prop="level">
            <el-select v-model="form.level" placeholder="请选择级别">
              <el-option
                v-for="item in levelList2"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog> -->
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
import { getList, updateList, addItem, deleteItem, getFather } from '@/web/api/school'
// eslint-disable-next-line no-unused-vars
import { getCity, getProvince, inProvince } from '@/web/api/area'
export default {
  data() {
    return {
      visible1: false,
      visible2: false,
      visible3: false,
      dialog: '',
      newItem: 0,
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      listLoading: true,
      collegeLoading: false,
      tableData: [],
      childrenData: [],
      total: 0,
      level: ['', '本科', '学院', '专业'],
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
        ],
        level: [
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
      },
      schoolLevelList: ['本科', '专科'],
      collegeLevelList: ['学院', '系'],
      majorLevelList: ['专业', '系'],
      schoolList: [],
      collegeList: [],
      college: '',
      provinceList: [],
      area: ['', ''],
      city: true,
      cityList: [],
      fathers: ['', '']
    }
  },
  watch: {
    area(n, o) {
      console.log('area', n)
      if (n[0] === '') {
        this.city = true
        console.log('city', this.city)
        this.area[1] = ''
      } else {
        this.city = false
        inProvince(n[0], n[1]).then(response => {
          console.log('inProvince', response.data.result)
          if (response.data.result === false) {
            this.area[1] = ''
          }
        })
        getCity(n[0]).then(response => {
          this.cityList = response.data.items
        })
      }
    },
    form(n, o) {
      console.log('fatherId', n.fatherId)
      getFather(n.fatherId).then(response => {
        this.fathers = response.data.fathers
        console.log('fathers', this.fathers)
        this.college = this.fathers[1].id
        if (n.type === 3) {
          getList(-1, -1, 2, '', this.fathers[0].id).then(response => {
            console.log('collegeList', response.data.items)
            this.collegeList = response.data.items
          })
        }
      })
    }
  },
  created() {
    this.fetchData()
    this.levelList1 = this.schoolLevelList
  },
  methods: {
    fetchData() {
      getProvince().then(response => {
        this.provinceList = response.data.items
        console.log('provinceList', this.provinceList)
      })
      getCity('福建省').then(response => {
        this.cityList = response.data.items
        console.log('cityList', this.cityList)
      })
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
        level: '',
        hasChildren: false,
        type: this.row.type + 1,
        childrenType: '',
        fatherId: this.row.id,
        address: ''
      }
      this.area = ['', '']
      console.log('type', this.row.type)
      if (this.row.type === 0) {
        this.dialog = '添加学校'
      } else {
        if (this.row.type === 3) {
          this.form.type = 3
          this.form.fatherId = this.row.fatherId
          // this.levelList2 = this.majorLevelList
        }
        if (this.form.type === 3) {
          this.levelList2 = this.majorLevelList
        } else {
          this.levelList2 = this.collegeLevelList
        }
        this.dialog = '添加' + this.level[this.form.type].toString()
      }
      this.form.level = this.level[this.form.type]
      this.visible1 = true
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
      this.area = this.form.address.split(' ')
      console.log('address', this.form.address)
      if (row.type === 1) {
        this.dialog = '编辑学校'
      } else {
        if (this.form.type === 3) {
          this.levelList2 = this.majorLevelList
        } else {
          this.levelList2 = this.collegeLevelList
        }
        this.dialog = '编辑' + this.level[this.form.type].toString()
      }
      this.visible1 = true
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.visible3 = true
    },
    // grtChildren(type, ID) {
    //   getList(-1, -1, type, '', ID).then(response => {
    //     console.log('grtChildren', response.data.items)
    //     this.childrenData = response.data.items
    //   })
    // },
    refreshRow(type, ID) {
      getList(this.currentPage, this.pagesize, type, '', ID).then(response => {
        console.log('refreshRow', type, ID, response.data.items)
        this.$set(this.$refs.table.store.states.lazyTreeNodeMap, ID, response.data.items)
      })
    },
    update() {
      console.log('form', this.form.id, this.form.type, this.form.fatherId)
      const id = this.form.fatherId
      this.form.address = this.area.join(' ')
      if (this.form.type === 3) {
        this.form.fatherId = this.college
      }
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
        this.refreshRow(this.form.type, id)
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
    },
    resetData() {
      this.listLoading = true
      this.currentPage = 1
      this.name = ''
      this.fetchData()
    },
    load(tree, treeNode, resolve) {
      console.log('参数', tree.childrenType, tree.id)
      // this.grtChildren(tree.childrenType, tree.id)
      getList(-1, -1, tree.childrenType, '', tree.id).then(response => {
        console.log('grtChildren', response.data.items)
        this.childrenData = response.data.items
        resolve(this.childrenData)
      })
      // setTimeout(() => {
      //   console.log('childrenData', this.childrenData)
      //   resolve(this.childrenData)
      // }, 1000)
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
