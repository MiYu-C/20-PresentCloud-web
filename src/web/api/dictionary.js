import request from '@/web/utils/request'

export function getData(currentPage, pagesize) {
  return request({
    url: '/present-cloud/dictionary/data',
    method: 'get',
    params: { currentPage, pagesize }
  })
}
