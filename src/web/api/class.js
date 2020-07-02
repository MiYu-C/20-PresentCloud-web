import request from '@/web/utils/request'

export function getStudents(id) {
  return request({
    url: 'api/course/student?id=' + id,
    method: 'get'
  })
}

export function get(params) {
  return request({
    url: 'api/course',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/course',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/course/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/course',
    method: 'put',
    data
  })
}

export default { get, add, edit, del }
