<template>
  <el-card class="box-card">
    <div>
      <el-row>
        <span>菜单名：</span>
        <el-input
          v-model="name"
          placeholder="请输入菜单名"
          style="width: 200px;"
        />
        <!-- <span>日期：</span>
        <el-date-picker
          v-model="time"
          type="date"
          placeholder="请选择时间"
          style="width: 200px;"
        /> -->
        <el-button type="primary" style="margin-left: 10px" @click="handlesearch">查询</el-button>
        <el-button @click="resetData">重置</el-button>
      </el-row>
      <el-row>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加</el-button>
        <el-button size="small">批量操作</el-button>
      </el-row>
    </div>
    <div>
      <el-table
        ref="table"
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        highlight-current-row
        @current-change="tableCurrentChange"
      >
        <el-table-column
          prop="name"
          label="菜单名称"
          width="155"
        />
        <el-table-column
          prop="icon"
          label="图标"
          width="55"
          align="center"
        >
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
          </template>
        </el-table-column>
        <el-table-column
          prop="order"
          label="排序"
          align="center"
        />
        <el-table-column
          prop="router"
          label="路由地址"
          align="center"
        />
        <el-table-column
          prop="index"
          label="组件路径"
          align="center"
          width="150"
        />
        <el-table-column prop="isView" label="是否可见" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isView">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="创建时间"
          align="center"
          width="140"
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
      <el-dialog
        :title="dialog"
        :visible.sync="visible1"
        width="50%"
        :show-close="false"
        :destroy-on-close="true"
      >
        <el-col :span="22">
          <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="80px">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入组件名称" />
            </el-form-item>
            <el-form-item label="菜单类型">
              <el-radio-group v-model="form.type" size="mini">
                <el-radio-button :label="1">目录</el-radio-button>
                <el-radio-button :label="2">菜单</el-radio-button>
                <el-radio-button :label="3">按钮</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="form.type.toString() !== '3'" label="菜单图标" prop="icon">
              <el-input v-model="form.icon" placeholder="选择图标">
                <template slot="prepend"><svg-icon :icon-class="form.icon ? form.icon : ''" /></template>
                <!-- <el-popover :ref="form.id" slot="append" v-model="visible" placement="right" width="300" trigger="click">
                  <el-row>
                    <el-col v-for="(item,index) in icons" :key="index" :span="6">
                      <el-button @click="selectIcon(item)">
                        <svg-icon :icon-class="item ? item : ''" />
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-button slot="reference">选择</el-button>
                </el-popover> -->
                <el-button slot="append" @click="iconVisible = true">选择</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="菜单可见">
              <el-radio-group v-model="form.isView" size="mini">
                <el-radio-button :label="true">是</el-radio-button>
                <el-radio-button :label="false">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="order" size="mini">
              <el-input-number v-model="form.order" :min="1" :max="999" clearable />
            </el-form-item>
            <el-form-item v-show="form.type.toString() !== '3'" label="路由地址">
              <el-input v-model="form.router" placeholder="请输入路由地址" />
            </el-form-item>
            <el-form-item v-show="form.type.toString() === '2'" label="组件路径">
              <el-input v-model="form.index" placeholder="请输入组件路径" />
            </el-form-item>
            <el-form-item label="权限">
              <el-input v-model="form.competence" placeholder="请输入权限" />
            </el-form-item>
            <el-form-item label="上级菜单" prop="father">
              <!-- <Treeselect
                :props="props"
                :options="treeData"
                :value="form.fatherId"
                @getValue="getValue($event)"
              /> -->
              <treeselect
                v-model="form.fatherId"
                :options="treeData"
                :normalizer="normalizer"
                :clearable="false"
                style="width: 200px;"
                placeholder="选择上级类目"
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
      <el-dialog
        title="选择图标"
        :visible.sync="iconVisible"
        width="50%"
        :show-close="false"
        :destroy-on-close="true"
      >
        <el-row>
          <el-col v-for="(item,index) in icons" :key="index" :span="3">
            <el-button @click="selectIcon(item)">
              <svg-icon :icon-class="item ? item : ''" />
            </el-button>
          </el-col>
        </el-row>
        <el-button slot="reference">选择</el-button>
      </el-dialog>
    </div>
  </el-card>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getList, updateList, addItem, deleteItem, getFather, isExist } from '@/web/api/menu'
// import Treeselect from '@/components/treeSelect.vue'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: {
    Treeselect
  },
  data() {
    const nameValidate = (rule, value, callback) => {
      console.log('isExist', this.form.id, this.form.name)
      if (this.form.name === '') {
        callback('不能为空')
      }
      isExist(this.form.id, this.form.name, this.form.type, 'name').then(response => {
        const exist = response.data
        console.log('exist', exist)
        if (exist) {
          callback(value + '已存在')
        } else {
          callback()
        }
      })
    }
    const orderValidate = (rule, value, callback) => {
      console.log('isExist', this.form.id, '0', this.form.order)
      isExist(this.form.id, this.form.order, '0', 'order').then(response => {
        const exist = response.data
        console.log('exist', exist)
        if (exist) {
          callback('排序' + value + '已存在')
        } else {
          callback()
        }
      })
    }
    const fatherValidate = (rule, value, callback) => {
      console.log('father', this.form.id, this.form.fatherId)
      if (this.form.id === null) {
        callback('上级菜单不能为空')
      }
      if (this.form.id === this.form.fatherId) {
        callback('上级菜单不能为自身')
      } else {
        callback()
      }
    }
    const iconValidate = (rule, value, callback) => {
      console.log('icon', this.form.icon)
      const index = this.icons.findIndex(item => item.toString() === this.form.icon.toString())
      if (index === -1) {
        callback('图标不存在')
      } else {
        callback()
      }
    }
    return {
      // props: { // 配置项（必选）
      //   value: 'id',
      //   label: 'name',
      //   children: 'children'
      //   // disabled:true
      // },
      defaultForm: {
        id: 0,
        name: '',
        icon: '',
        order: 0,
        type: 1,
        router: '',
        index: '',
        competence: '',
        isView: 'true',
        fatherId: 1,
        hasChildren: false,
        createtime: ''
      },
      data: [],
      icons: [],
      time: '',
      visible1: false,
      deleteVisible: false,
      iconVisible: false,
      dialog: '',
      newItem: 0,
      name: '',
      pagesizes: [5, 10, 15, 20],
      listLoading: true,
      collegeLoading: false,
      tableData: [],
      treeData: [],
      childrenData: [],
      total: 0,
      type: ['', '目录', '菜单', '按钮'],
      form: {
        id: 0,
        name: '',
        icon: '',
        order: 0,
        type: 1,
        router: '',
        index: '',
        competence: '',
        isView: 'true',
        fatherId: 1,
        hasChildren: false,
        createtime: ''
      },
      rules: {
        name: [
          { validator: nameValidate, trigger: 'blur' }
        ],
        level: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        order: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: orderValidate, trigger: 'blur' }
        ],
        father: [
          { validator: fatherValidate, trigger: 'blur' }
        ],
        icon: [
          { validator: iconValidate, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
    this.readFile()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.name, '-1').then(response => {
        this.tableData = response.data.items
        this.tableData = this.setTreeData(this.tableData, 1)
        console.log('tableData', this.tableData)
        this.listLoading = false
      })
      getList('', '-1').then(response => {
        this.data = response.data.items
        console.log('Data', this.data)
        this.treeData = this.setTreeData(this.data, 0)
        // this.tableData = this.treeData[0].children
        console.log('treeData', this.treeData)
        this.listLoading = false
      })
    },
    tableCurrentChange(val) {
      console.log(`第 ${val.id} 条`)
      console.log('row', val)
    },
    handleEdit(index, row) {
      console.log(index, row.type)
      this.form = JSON.parse(JSON.stringify(row))
      this.visible1 = true
    },
    handleAdd() {
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.visible1 = true
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.form = JSON.parse(JSON.stringify(row))
      this.deleteVisible = true
    },
    refreshRow(ID) {
      getList('', ID).then(response => {
        console.log('refreshRow', ID, response.data.items)
        this.$set(this.$refs.table.store.states.lazyTreeNodeMap, ID, response.data.items)
      })
    },
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('编辑成功!')
          console.log('form', this.form.id, this.form.type, this.form.fatherId)
          let id = 0
          if (this.form.id > 0) {
            const index = this.data.findIndex(item => item.id === this.form.id)
            id = this.data[index].fatherId
          }
          console.log('id', id)
          this.listLoading = true
          if (this.form.id === 0) {
            const date = new Date()
            this.form.createtime = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + ' ' + date.getHours().toString() + ':' + date.getMinutes().toString()
            console.log('date', this.form.createtime)
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
          this.fetchData()
          console.log('form', this.form.type, this.form.fatherId)
          if (id > 1) {
            this.refreshRow(id)
            this.refreshRow(this.form.fatherId)
          }
          if (this.form.fatherId > 1) {
            console.log('fatherId', this.form.fatherId)
            this.refreshRow(id)
            this.refreshRow(this.form.fatherId)
          }
          this.closeForm()
          this.fetchData()
        }
      })
    },
    delete1() {
      deleteItem(this.form).then(response => {
        console.log('delete', response.data)
        this.total = response.data
      })
      if (this.form.type !== '1') {
        console.log('form', this.form.type, this.form.fatherId)
        this.refreshRow(this.form.fatherId)
      }
      this.closeForm()
      this.fetchData()
    },
    closeForm() {
      this.visible1 = false
      this.deleteVisible = false
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
    },
    handlesearch() {
      this.listLoading = true
      console.log('search')
      getList(this.name, -1).then(response => {
        this.tableData = response.data.items
        console.log('search', this.tableData)
        this.listLoading = false
      })
    },
    resetData() {
      this.listLoading = true
      this.name = ''
      this.fetchData()
    },
    load(tree, treeNode, resolve) {
      console.log('参数', tree.childrenType, tree.id)
      // this.grtChildren(tree.childrenType, tree.id)
      getList('', tree.id).then(response => {
        console.log('grtChildren', response.data.items)
        this.childrenData = response.data.items
        resolve(this.childrenData)
      })
      this.childrenData = []
    },
    // 选中图标
    selected(name) {
      console.log('icon', name)
      this.form.icon = name
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
    // 取值
    // getValue(value) {
    //   // this.valueId = value
    //   this.form.fatherId = value
    //   console.log('value', value)
    // },
    // 读取图标文件
    readFile() {
      const req = require.context('@/icons/svg', false, /\.svg$/)
      const requireAll = requireContext => requireContext.keys()
      const re = /\.\/(.*)\.svg/
      this.icons = requireAll(req).map(i => {
        return i.match(re)[1]
      })
      console.log('icons', this.icons)
    },
    selectIcon(icon) {
      console.log('icon', this.icon)
      this.form.icon = icon
      this.iconVisible = false
    },
    // 替换树形选择器label
    normalizer(node) {
      return {
        label: node.name
      }
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
