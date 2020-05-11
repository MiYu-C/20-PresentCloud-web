import Mock from 'mockjs'
const data = Mock.mock({
  'items': [{
    id: 1,
    name: '顶级菜单',
    icon: 'user',
    order: 0,
    type: 0,
    router: '123',
    index: '123',
    competence: '123',
    isView: 'true',
    fatherId: 0,
    hasChildren: true,
    createtime: '123'
  }, {
    id: 2,
    name: '首页',
    icon: 'list',
    order: 1,
    type: 1,
    router: '1',
    index: '',
    competence: '321',
    isView: 'true',
    fatherId: 1,
    hasChildren: false,
    createtime: '2019-12-12 13:22'
  }, {
    id: 4,
    name: '标准界面',
    icon: 'list',
    order: 2,
    type: 1,
    router: '123',
    index: '',
    competence: '321',
    isView: 'true',
    fatherId: 1,
    hasChildren: false,
    createtime: '2019-12-12 13:22'
  }, {
    id: 3,
    name: '用户管理',
    icon: 'list',
    order: 3,
    type: 1,
    router: '123',
    index: '',
    competence: '321',
    isView: 'true',
    fatherId: 1,
    hasChildren: false,
    createtime: '2019-12-12 13:22'
  }, {
    id: 11,
    name: '角色管理',
    icon: 'list',
    order: 4,
    type: 1,
    router: '123',
    index: '',
    competence: '321',
    isView: 'true',
    fatherId: 1,
    hasChildren: false,
    createtime: '2019-12-12 13:22'
  }, {
    id: 5,
    name: '系统管理',
    icon: 'list',
    order: 5,
    type: 1,
    router: '123',
    index: '',
    competence: '321',
    isView: 'true',
    fatherId: 1,
    hasChildren: false,
    createtime: '2019-12-12 13:22'
  }, {
    id: 6,
    name: '学校管理',
    icon: 'user',
    order: 6,
    type: 1,
    router: '123',
    index: '',
    competence: '321',
    isView: 'true',
    fatherId: 1,
    hasChildren: false,
    createtime: '2019-12-12 13:22'
  }, {
    id: 7,
    name: '异常管理',
    icon: 'user',
    order: 7,
    type: 1,
    router: '123',
    index: '',
    competence: '321',
    isView: 'true',
    fatherId: 1,
    hasChildren: false,
    createtime: '2019-12-12 13:22'
  }, {
    id: 8,
    name: '学生管理',
    icon: 'user',
    order: 8,
    type: 2,
    router: '123',
    index: 'User/student',
    competence: '321',
    isView: 'true',
    fatherId: 3,
    hasChildren: false,
    createtime: '2019-12-12 13:22'
  }, {
    id: 9,
    name: '教师管理',
    icon: 'user',
    order: 9,
    type: 2,
    router: '123',
    index: 'User/teacher',
    competence: '321',
    isView: 'true',
    fatherId: 3,
    hasChildren: false,
    createtime: '2019-12-12 13:22'
  }, {
    id: 10,
    name: '管理员',
    icon: 'user',
    order: 10,
    type: 2,
    router: '123',
    index: 'User/manager',
    competence: '1221',
    isView: 'true',
    fatherId: 3,
    hasChildren: false,
    createtime: '2019-12-12 13:22'
  }]
})

export default [
  {
    url: '/vue-admin-template/menu/data',
    type: 'get',
    response: config => {
      const { name, fatherId } = config.query
      let items = []
      if (fatherId === '-1') {
        items = data.items
      } else {
        items = data.items.filter(data => data.fatherId.toString() === fatherId.toString())
      }
      if (name.length > 0) {
        items = items.filter(data => {
          // some() 方法用于检测数组中的元素是否满足指定条件;
          // some() 方法会依次执行数组的每个元素：
          // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
          // 如果没有满足条件的元素，则返回false。
          // 注意： some() 不会对空数组进行检测。
          // 注意： some() 不会改变原始数组。
          return Object.keys(data).some(key => {
            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
            // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
            return String(data['name']).toLowerCase().indexOf(name) > -1
          })
        })
      }
      items = items.sort(function(a, b) {
        const x = a['order']
        const y = b['order']
        return ((x < y) ? -1 : (x > y) ? 1 : 0)
      })
      return {
        code: 20000,
        data: {
          items: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/menu/update',
    type: 'put',
    response: config => {
      const { form } = config.query
      const newform = JSON.parse(form)
      let index = data.items.findIndex(item => item.id === newform.id)
      const oldFather = data.items[index].fatherId
      data.items[index] = newform
      index = data.items.findIndex(item => item.fatherId === oldFather)
      if (index < 0) {
        index = data.items.findIndex(item => item.id === oldFather)
        data.items[index].hasChildren = false
      }
      return {
        code: 20000,
        data: newform
      }
    }
  },
  {
    url: '/vue-admin-template/menu/delete',
    type: 'delete',
    response: config => {
      const { form } = config.query
      const deleteform = JSON.parse(form)
      let index = data.items.findIndex(item => item.id === deleteform.id)
      data.items.splice(index, 1)
      index = data.items.findIndex(item => item.fatherId === deleteform.fatherId)
      if (index < 0) {
        index = data.items.findIndex(item => item.id === deleteform.fatherId)
        data.items[index].hasChildren = false
      }
      index = data.items.findIndex(item => item.fatherId === deleteform.id)
      while (index > -1) {
        data.items.splice(index, 1)
        index = data.items.findIndex(item => item.fatherId === deleteform.id)
      }
      const menus = data.items.filter(data => data.type === 1)
      return {
        code: 20000,
        data: menus.length
      }
    }
  },
  {
    url: '/vue-admin-template/menu/add',
    type: 'post',
    response: config => {
      const { form } = config.query
      const newform = JSON.parse(form)
      newform.id = Mock.Random.natural(23, 10000)
      let index = data.items.findIndex(item => item.id === newform.fatherId)
      if (index > -1) {
        data.items[index].hasChildren = true
      }
      data.items.push(newform)
      const menus = data.items.filter(data => data.type === 1)
      index = menus.findIndex(data => data.id === newform.id)
      return {
        code: 20000,
        data: index
      }
    }
  },
  {
    url: '/vue-admin-template/menu/getFather',
    type: 'get',
    response: config => {
      const { fatherId } = config.query
      const index = data.items.findIndex(item => item.id.toString() === fatherId.toString())
      // eslint-disable-next-line prefer-const
      let father = ['', '']
      if (index > -1) {
        // school = true
        father.id = data.items[index].id
        father.name = data.items[index].name
      }
      return {
        code: 20000,
        data: {
          father: father
        }
      }
    }
  },
  {
    url: '/vue-admin-template/menu/exist',
    type: 'get',
    response: config => {
      const { id, value, type } = config.query
      let index = data.items.findIndex(item => item.id.toString() === id.toString())
      const thisType = data.items[index].type
      let table = data.items.filter(item => item.id > 1)
      table = table.filter(item => item.id.toString() !== id)
      index = -1
      if (type === 'name') {
        table = table.filter(item => item.type.toString() === thisType.toString())
        index = table.findIndex(item => item.name.toString() === value.toString())
      }
      if (type === 'order') {
        index = table.findIndex(item => item.order.toString() === value.toString())
      }
      let exist = false
      if (index > -1) {
        exist = true
      }
      return {
        code: 20000,
        data: exist
      }
    }
  }
]
