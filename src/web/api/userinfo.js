import request from '@/web/utils/request'

export function getList(currentPage, pagesize, type, name, ID) {
  return request({
    url: '/vue-admin-template/userinfo/data',
    method: 'get',
    params: { currentPage, pagesize, type, name, ID }
  })
}

export function updateList(form) {
  return request({
    url: '/vue-admin-template/userinfo/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem(form) {
  return request({
    url: '/vue-admin-template/userinfo/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem(form) {
  return request({
    url: '/vue-admin-template/userinfo/add',
    method: 'post',
    params: { form }
  })
}
