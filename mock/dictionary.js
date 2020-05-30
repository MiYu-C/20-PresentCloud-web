const data = ({
  'items': [{
    id: 1,
    name: '学校',
    description: '描述',
    default: 1
  }, {
    id: 2,
    name: '用户类型',
    description: '描述',
    default: 4
  }, {
    id: 3,
    name: '角色类型',
    description: '描述',
    default: 0
  }, {
    id: 4,
    name: '菜单类型',
    description: '描述',
    default: 0
  }, {
    id: 5,
    name: '性别',
    description: '描述',
    default: 7
  }, {
    id: 6,
    name: '学院',
    description: '描述',
    default: 0
  }, {
    id: 7,
    name: '数据权限',
    description: '描述',
    default: 0
  }]
})

export default [
  {
    url: '/present-cloud/dictionary/data',
    type: 'get',
    response: config => {
      const { currentPage, pagesize } = config.body
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        }
      }
    }
  }
]
