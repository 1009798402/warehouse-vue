import request from '@/utils/request'

export function listShop(query) {
  return request({
    url: '/shop/list',
    method: 'get',
    params: query
  })
}
