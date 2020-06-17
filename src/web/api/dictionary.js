import request from '@/web/utils/request'

export function getList(currentPage, pagesize, name) {
  return request({
    url: '/present-cloud/dictionary/data',
    method: 'get',
    params: { currentPage, pagesize, name }
  })
}

export function getLabel(id) {
  return request({
    url: '/present-cloud/dictionary/label',
    method: 'get',
    params: { id }
  })
}

export function updateList(form, dictData) {
  return request({
    url: '/present-cloud/dictionary/update',
    method: 'put',
    params: { form, dictData }
  })
}

export function deleteItem(form) {
  return request({
    url: '/present-cloud/dictionary/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem(form, dictData) {
  return request({
    url: '/present-cloud/dictionary/add',
    method: 'post',
    params: { form, dictData }
  })
}

export function isExist(id, name) {
  return request({
    url: '/present-cloud/dictionary/exist',
    method: 'get',
    params: { id, name }
  })
}

