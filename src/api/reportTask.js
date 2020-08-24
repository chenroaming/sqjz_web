/**
 * 抽查任务
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 创建抽查任务(社区矫正使用)
 * @return [state]
 */
export function add(data) {
  return request({
    url: '/community_correction/webClass/reportTask/add.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      ...data
    })
  })
}

/**
 * @description 查询抽查任务(社区矫正使用)
 * @return [state]
 */
export function find(data) {
  return request({
    url: '/community_correction/webClass/reportTask/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      ...data
    })
  })
}

/**
 * @description 查询抽查任务详情(社区矫正使用)
 * @return [state]
 */
export function findRecord(data) {
  return request({
    url: '/community_correction/webClass/reportTask/findRecord.jhtml',
    method: 'post',
    data: Qs.stringify({
      ...data
    })
  })
}
