import request from '@/web/utils/request'

// export function getList(currentPage, pagesize, order) {
//   return request({
//     url: '/present-cloud/list/data',
//     method: 'get',
//     params: { currentPage, pagesize, order }
//   })
// }

export function getList1(name) {
  return request({
    url: '/present-cloud/present/data',
    method: 'get',
    params: { name }
  })
}

export function updateList1(form) {
  return request({
    url: '/present-cloud/present/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem1(form) {
  return request({
    url: '/present-cloud/present/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem1(form) {
  return request({
    url: '/present-cloud/present/add',
    method: 'post',
    params: { form }
  })
}

export function isExist1(id, name) {
  return request({
    url: '/present-cloud/present/exist',
    method: 'get',
    params: { id, name }
  })
}

export function level_isExist(id, level) {
  return request({
    url: '/present-cloud/present/level_exist',
    method: 'get',
    params: { id, level }
  })
}

