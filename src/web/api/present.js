import request from '@/web/utils/request'

// export function getList(currentPage, pagesize, order) {
//   return request({
//     url: '/vue-admin-template/list/data',
//     method: 'get',
//     params: { currentPage, pagesize, order }
//   })
// }

export function getList1(name) {
  return request({
    url: '/vue-admin-template/present/data',
    method: 'get',
    params: { name }
  })
}

export function updateList1(form) {
  return request({
    url: '/vue-admin-template/present/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem1(form) {
  return request({
    url: '/vue-admin-template/present/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem1(form) {
  return request({
    url: '/vue-admin-template/present/add',
    method: 'post',
    params: { form }
  })
}

export function isExist1(id, name) {
  return request({
    url: '/vue-admin-template/present/exist',
    method: 'get',
    params: { id, name }
  })
}

export function level_isExist(id, level) {
  return request({
    url: '/vue-admin-template/present/level_exist',
    method: 'get',
    params: { id, level }
  })
}

