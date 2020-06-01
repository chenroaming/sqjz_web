/**
 * 预警信息
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 用户查看走访信息 (社区矫正)
 * @return [List]
 */
export function find(interviewId = '', userId = '', name = '', interviewType = 1, pageNumber = 1, pageSize = 5) {
  return request({
    url: '/community_correction/webClass/interviewRecord/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      interviewId,
      userId,
      name,
      interviewType,
      pageSize,
      pageNumber
    })
  })
}
