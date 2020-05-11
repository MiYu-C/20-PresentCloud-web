import request from '@/web/utils/request'

export function getList(currentPage, pagesize, name) {
  return request({
    url: '/vue-admin-template/role/data',
    method: 'get',
    params: { currentPage, pagesize, name }
  })
}

export function updateList(form) {
  return request({
    url: '/vue-admin-template/role/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem(form) {
  return request({
    url: '/vue-admin-template/role/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem(form) {
  return request({
    url: '/vue-admin-template/role/add',
    method: 'post',
    params: { form }
  })
}

export function isExist(id, name, fatherId) {
  return request({
    url: '/vue-admin-template/role/exist',
    method: 'get',
    params: { id, name, fatherId }
  })
}
