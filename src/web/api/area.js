import request from '@/web/utils/request'

export function getProvince() {
  return request({
    url: '/vue-admin-template/area/province',
    method: 'get'
  })
}
export function getCity(province) {
  return request({
    url: '/vue-admin-template/area/city',
    method: 'get',
    params: { province }
  })
}
export function inProvince(province, city) {
  return request({
    url: '/vue-admin-template/area/inProvince',
    method: 'get',
    params: { province, city }
  })
}
