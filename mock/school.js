import Mock from 'mockjs'
const data = Mock.mock({
  'items': [{
    id: 1,
    name: '@cword( 2, 3 )' + '大学',
    level: '本科',
    hasChildren: true,
    type: 1,
    childrenType: 2,
    fatherId: 0,
    address: '福建省 泉州市'
  }, {
    id: 2,
    name: '@cword( 2, 3 )' + '大学',
    level: '本科',
    hasChildren: false,
    type: 1,
    childrenType: 2,
    fatherId: 0,
    address: '@city("true")'
  }, {
    id: 3,
    name: '@cword( 2, 3 )' + '大学',
    level: '本科',
    hasChildren: false,
    type: 1,
    childrenType: 2,
    fatherId: 0,
    address: '@city("true")'
  }, {
    id: 4,
    name: '@cword( 2, 3 )' + '大学',
    level: '本科',
    hasChildren: false,
    type: 1,
    childrenType: 2,
    fatherId: 0,
    address: '@city("true")'
  }, {
    id: 5,
    name: '@cword( 2, 3 )' + '大学',
    level: '本科',
    hasChildren: false,
    type: 1,
    childrenType: 2,
    fatherId: 0,
    address: '@city("true")'
  }, {
    id: 6,
    name: '@cword( 2, 3 )' + '大学',
    level: '本科',
    hasChildren: false,
    type: 1,
    childrenType: 2,
    fatherId: 0,
    address: '@city("true")'
  }, {
    id: 7,
    name: '外语学院',
    level: '学院',
    hasChildren: true,
    type: 2,
    childrenType: 3,
    fatherId: 1,
    address: ''
  },
  {
    id: 8,
    name: '数计学院',
    level: '学院',
    hasChildren: true,
    type: 2,
    childrenType: 3,
    fatherId: 1,
    address: ''
  },
  {
    id: 9,
    name: '计算机技术',
    level: '专业',
    hasChildren: false,
    type: 3,
    childrenType: 3,
    fatherId: 8,
    address: ''
  },
  {
    id: 10,
    name: '数学',
    level: '专业',
    hasChildren: false,
    type: 3,
    childrenType: 3,
    fatherId: 8,
    address: ''
  },
  {
    id: 11,
    name: '英语',
    level: '专业',
    hasChildren: false,
    type: 3,
    childrenType: 3,
    fatherId: 7,
    address: ''
  }]
})

export default [
  {
    url: '/vue-admin-template/school/data',
    type: 'get',
    response: config => {
      const { currentPage, pagesize, type, name, fatherId } = config.query
      let schools = data.items.filter(data => data.type === 1)
      let items = data.items.filter(data => data.type.toString() === type)
      if (type === '1') {
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
          schools = items
        }
        items = items.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      } else {
        items = items.filter(data => data.fatherId.toString() === fatherId)
      }
      return {
        code: 20000,
        data: {
          total: schools.length,
          items: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/school/update',
    type: 'put',
    response: config => {
      const { form } = config.query
      const newform = JSON.parse(form)
      const index = data.items.findIndex(item => item.id === newform.id)
      data.items[index] = newform
      return {
        code: 20000,
        data: newform
      }
    }
  },
  {
    url: '/vue-admin-template/school/delete',
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
      while (index > 0) {
        data.items.splice(index, 1)
        index = data.items.findIndex(item => item.fatherId === deleteform.id)
      }
      const schools = data.items.filter(data => data.type === 1)
      return {
        code: 20000,
        data: schools.length
      }
    }
  },
  {
    url: '/vue-admin-template/school/add',
    type: 'post',
    response: config => {
      const { form } = config.query
      const newform = JSON.parse(form)
      newform.id = Mock.Random.natural(23, 10000)
      let index = data.items.findIndex(item => item.id === newform.fatherId)
      if (index > 0) {
        data.items[index].hasChildren = true
      }
      data.items.push(newform)
      const schools = data.items.filter(data => data.type === 1)
      index = schools.findIndex(data => data.id === newform.id)
      return {
        code: 20000,
        data: index
      }
    }
  }
]
