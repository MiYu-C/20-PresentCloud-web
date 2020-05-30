import request from '@/web/utils/request'

export function getList(name, fatherId) {
  return request({
    url: '/present-cloud/menu/data',
    method: 'get',
    params: { name, fatherId }
  })
}

export function updateList(form) {
  return request({
    url: '/present-cloud/menu/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem(form) {
  return request({
    url: '/present-cloud/menu/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem(form) {
  return request({
    url: '/present-cloud/menu/add',
    method: 'post',
    params: { form }
  })
}

export function getFather(fatherId) {
  return request({
    url: '/present-cloud/menu/getFather',
    method: 'get',
    params: { fatherId }
  })
}

export function isExist(id, value, thisType, type) {
  return request({
    url: '/present-cloud/menu/exist',
    method: 'get',
    params: { id, value, thisType, type }
  })
}
