/**
 * 首页信息api
 */
import request from '@/utils/request'

/**
 * @description 获取首页头部数据
 * @return [List]
 */
export function getCardList() {
  return request({
    url: '/face_recognition/webClass/statistics/baseMessageCount.jhtml',
    method: 'post'
  })
}

/**
 * @description 获取图表数据
 * @return [List]
 */
export function getChartList() {
  return request({
    url: '/face_recognition/webClass/statistics/countByDateRange.jhtml',
    method: 'post'
  })
}

/**
 * @description 获取用户类别数据
 * @return [List]
 */
export function getPersonSortList() {
  return request({
    url: '/face_recognition/webClass/statistics/countByUserType.jhtml',
    method: 'post'
  })
}
