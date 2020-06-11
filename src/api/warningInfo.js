/**
 * 预警信息
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 用户查看预警信息 (社区矫正)
 * @return [List]
 */
export function find(warningId = '', warningType = '', userId = '', pageNumber = 1, pageSize = 10 ) {
  return request({
    url: '/community_correction/webClass/warningInfo/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      warningId,
      warningType,
      userId,
      pageSize,
      pageNumber
    })
  })
}

/**
 * @description 用户处置预警信息 (社区矫正)
 * @return [state]
 */
export function dispose(warningId = '', reason = '', result = '') {
  return request({
    url: '/community_correction/webClass/warningInfo/dispose.jhtml',
    method: 'post',
    isShowTips:true,
    data: Qs.stringify({
      warningId,
      reason,
      result
    })
  })
}