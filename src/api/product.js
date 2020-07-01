import request from '@/utils/request'

export function listProduct(query) {
  return request({
    url: '/product/list',
    method: 'get',
    params: query
  })
}
