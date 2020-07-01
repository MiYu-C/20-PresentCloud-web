import request from '@/web/utils/request'

export function login(data) {
  return request({
    // url: '/present-cloud/user/login',
    url: '/auth/login',
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/present-cloud/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
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

export function updateEmail(data) {
  // return request({
  //   url: '/present-cloud/user/getCode',
  //   method: 'get'
  // })
  return data
}

export function editUser(data) {
  return request({
    url: '/present-cloud/users/center',
    method: 'put',
    data
  })
}
