import request from '@/web/utils/request'

export function getData(currentPage, pagesize) {
  return request({
    url: '/vue-admin-template/dictionary/data',
    method: 'get',
    params: { currentPage, pagesize }
  })
}
