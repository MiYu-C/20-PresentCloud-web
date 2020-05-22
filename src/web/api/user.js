import request from '@/web/utils/request'

export function login(data) {
  return request({
    url: '/present-cloud/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/present-cloud/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/present-cloud/user/logout',
    method: 'post'
  })
}

export function changePassword(form) {
  return request({
    url: '/present-cloud/user/changePassword',
    method: 'post',
    params: { form }
  })
}

export function getCode() {
  return request({
    url: '/present-cloud/user/getCode',
    method: 'get'
  })
}
