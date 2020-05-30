import request from '@/web/utils/request'

// export function getList(currentPage, pagesize, order) {
//   return request({
//     url: '/present-cloud/list/data',
//     method: 'get',
//     params: { currentPage, pagesize, order }
//   })
// }

export function getList(currentPage, pagesize, name) {
  return request({
    url: '/present-cloud/study/data',
    method: 'get',
    params: { currentPage, pagesize, name }
  })
}

export function updateList(form) {
  return request({
    url: '/present-cloud/study/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem(form) {
  return request({
    url: '/present-cloud/study/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem(form) {
  return request({
    url: '/present-cloud/study/add',
    method: 'post',
    params: { form }
  })
}

export function isExist(id, name) {
  return request({
    url: '/present-cloud/study/exist',
    method: 'get',
    params: { id, name }
  })
}
