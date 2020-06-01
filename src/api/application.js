/**
 * 社交管理
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 查询事务申请列表 (社区矫正)
 * @return [list]
 */
export function find(applyType = '', pageNumber = 1, pageSize = 5) {
  return request({
    url: '/community_correction/webClass/application/find.jhtml',
    method: 'post',
    data: Qs.stringify({
        applyType,
        pageNumber,
        pageSize
    })
  })
}

/**
 * @description 审核事务申请列表 (社区矫正)
 * @return [state]
 */
export function audit(data) {
    return request({
      url: '/community_correction/webClass/application/audit.jhtml',
      method: 'post',
      data: Qs.stringify({
        applyType:data.applyType,
        applyId:data.applyId,
        auditState:data.auditState,
        auditReason:data.auditReason
      })
    })
  }