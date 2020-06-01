import request from '@/utils/request'
import Qs from 'qs'


/**
 * @description 矫正人员基础信息统计(社区矫正使用)
 * @return [List]
 */
export function userBasicInfoCount() {
  return request({
    url: '/community_correction/webClass/statistics/userBasicInfoCount.jhtml',
    method: 'post',
  })
}


/**
 * @description 矫正人员活动信息统计(社区矫正使用)
 * @return [List]
 */
export function userActivityInfoCount() {
  return request({
    url: '/community_correction/webClass/statistics/userActivityInfoCount.jhtml',
    method: 'post',
  })
}
