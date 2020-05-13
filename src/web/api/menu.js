import request from '@/web/utils/request'

export function getList(name, fatherId) {
  return request({
    url: '/vue-admin-template/menu/data',
    method: 'get',
    params: { name, fatherId }
  })
}

export function updateList(form) {
  return request({
    url: '/vue-admin-template/menu/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem(form) {
  return request({
    url: '/vue-admin-template/menu/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem(form) {
  return request({
    url: '/vue-admin-template/menu/add',
    method: 'post',
    params: { form }
  })
}

export function getFather(fatherId) {
  return request({
    url: '/vue-admin-template/menu/getFather',
    method: 'get',
    params: { fatherId }
  })
}

export function isExist(id, value, thisType, type) {
  return request({
    url: '/vue-admin-template/menu/exist',
    method: 'get',
    params: { id, value, thisType, type }
  })
}
