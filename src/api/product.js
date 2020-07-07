/**
 * 产品信息
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 查询产品列表(社区矫正使用)
 * @return [List]
 */
export function findList(data) {
  return request({
    url: '/community_correction/webClass/productInfo/findList.jhtml',
    method: 'post',
    data: Qs.stringify({
      ...data
    })
  })
}

/**
 * @description 审核产品信息(社区矫正使用)
 * @return [state]
 */
export function audit(data) {
  return request({
    url: '/community_correction/webClass/productInfo/audit.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      ...data
    })
  })
}
