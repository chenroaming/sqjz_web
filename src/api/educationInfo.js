import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 提交教育资料信息(社区矫正使用)
 * @return [state]
 */
export function add(data) {
  return request({
    url: '/community_correction/webClass/educationInfo/add.jhtml',
    method: 'post',
    isShowTips: true,
    data: data
  })
}

/**
 * @description 修改教育资料信息(社区矫正使用)
 * @return [state]
 */
export function updateInfo(data) {
  return request({
    url: '/community_correction/webClass/educationInfo/update.jhtml',
    method: 'post',
    isShowTips: true,
    data: data
  })
}

/**
 * @description 删除教育资料信息(社区矫正使用)
 * @return [state]
 */
export function deleteInfo(data) {
  return request({
    url: '/community_correction/webClass/educationInfo/delete.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 查询教育资料列表(社区矫正使用)
 * @return [state]
 */
export function find(data) {
  return request({
    url: '/community_correction/webClass/educationInfo/find.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 查询教育资料列表(社区矫正使用)
 * @return [state]
 */
export function findEvaluationInfo(data) {
  return request({
    url: '/community_correction/webClass/evaluationInfo/find.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}
