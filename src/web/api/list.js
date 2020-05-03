import request from '@/web/utils/request'

// export function getList(currentPage, pagesize, order) {
//   return request({
//     url: '/vue-admin-template/list/data',
//     method: 'get',
//     params: { currentPage, pagesize, order }
//   })
// }

export function getList(currentPage, pagesize, order, name) {
  return request({
    url: '/vue-admin-template/list/data',
    method: 'get',
    params: { currentPage, pagesize, order, name }
  })
}

export function updateList(form) {
  return request({
    url: '/vue-admin-template/list/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem(form) {
  return request({
    url: '/vue-admin-template/list/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem(form) {
  return request({
    url: '/vue-admin-template/list/add',
    method: 'post',
    params: { form }
  })
}
