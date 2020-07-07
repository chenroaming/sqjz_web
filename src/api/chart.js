import request from '@/utils/request'

/**
 * @description 矫正对象基础信息统计(社区矫正使用)
 * @return [List]
 */
export function userBasicInfoCount() {
  return request({
    url: '/community_correction/webClass/statistics/userBasicInfoCount.jhtml',
    method: 'post'
  })
}

/**
 * @description 矫正对象活动信息统计(社区矫正使用)
 * @return [List]
 */
export function userActivityInfoCount() {
  return request({
    url: '/community_correction/webClass/statistics/userActivityInfoCount.jhtml',
    method: 'post'
  })
}
