import request from '@/web/utils/request'

export function getList(currentPage, pagesize, type, name, fatherId) {
  return request({
    url: '/vue-admin-template/school/data',
    method: 'get',
    params: { currentPage, pagesize, type, name, fatherId }
  })
}

export function updateList(form) {
  return request({
    url: '/vue-admin-template/school/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem(form) {
  return request({
    url: '/vue-admin-template/school/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem(form) {
  return request({
    url: '/vue-admin-template/school/add',
    method: 'post',
    params: { form }
  })
}

export function getFather(fatherId) {
  return request({
    url: '/vue-admin-template/school/getFather',
    method: 'get',
    params: { fatherId }
  })
}

export function isExist(id, name, fatherId) {
  return request({
    url: '/vue-admin-template/school/exist',
    method: 'get',
    params: { id, name, fatherId }
  })
}
