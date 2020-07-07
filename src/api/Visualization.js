/**
 * 可视化平台
 */
import request from '@/utils/request'
import Qs from 'qs'

export function Visualizationlogin() {
  return request({
    url: '/community_correction/webClass/statistics/getAdminInfo.jhtml',
    method: 'post'
  })
}
/**
 * @description 获取矫正对象位置
 * @return [List]
 */
export function GetPelpleLoacion() {
  const data = Qs.stringify({
    pageSize: 500,
    pageNumber: 1
  })
  return request({
    url: '/community_correction/webClass/trackRecord/find.jhtml',
    method: 'post',
    data
  })
}

/**
 * @description 矫正对象基础信息统计
 * @return [List]
 */
export function userBasicInfoCount() {
  return request({
    url: '/community_correction/webClass/statistics/userBasicInfoCount.jhtml',
    method: 'post'
  })
}

/**
 * @description 矫正对象监管信息统计
 * @return [List]
 */
export function userSupervisionInfoCount() {
  return request({
    url: '/community_correction/webClass/statistics/userSupervisionInfoCount.jhtml',
    method: 'post'
  })
}
