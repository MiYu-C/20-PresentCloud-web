import request from '@/web/utils/request'

export function getList(currentPage, pagesize, type, name, ID) {
  return request({
    url: '/present-cloud/userinfo/data',
    method: 'get',
    params: { currentPage, pagesize, type, name, ID }
  })
}

export function updateList(form) {
  return request({
    url: '/present-cloud/userinfo/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem(form) {
  return request({
    url: '/present-cloud/userinfo/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem(form) {
  return request({
    url: '/present-cloud/userinfo/add',
    method: 'post',
    params: { form }
  })
}

export function isExist(id, value, type, kind) {
  return request({
    url: '/present-cloud/userinfo/exist',
    method: 'get',
    params: { id, value, type, kind }
  })
}
