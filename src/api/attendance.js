/**
 * 获取考勤信息
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 用户查看矫正人员报告记录详情 (社区矫正)
 * @return [List]
 */
export function getCheckList2(userId = '', pageNumber = 1, pageSize = 10, ) {
  return request({
    url: '/community_correction/webClass/clock/findRecordDetail.jhtml',
    method: 'post',
    data: Qs.stringify({
      userId,
      pageSize,
      pageNumber
    })
  })
}
/**
 * @description 获取报告任务列表
 * @return [List]
 */
export function geclockList(ruleName = '', pageSize = 10, pageNumber = 1, ruleId = '') {
  return request({
    url: '/community_correction/webClass/clock/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      ruleName,
      pageSize,
      pageNumber,
      ruleId
    })
  })
}
/**
 * @description 删除任务
 * @return [List]
 */
export function deleteTask(ruleId = '') {
  return request({
    url: '/community_correction/webClass/clock/delete.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      ruleId
    })
  })
}

/**
 * @description 新增打卡规则(社区矫正使用)
 * @return [List]
 */
export function addclock(ruleName, ruleType, period, startTimes, endTimes) {
  return request({
    url: '/community_correction/webClass/clock/add.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      ruleName,
      // 规则名称
      ruleType,
      // 规则类型
      period,
      // 打卡周期
      startTimes,
      // 开始时间
      endTimes
      // 结束时间
    })
  })
}

/**
 * @description 获取积分任务列表(社区矫正使用)
 * @return [List]
 */
export function getintegral(pageSize, pageNumber, taskId, content) {
  return request({
    url: '/community_correction/webClass/ptnetwork/integral/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      pageSize,
      // 任务每页数目每页几条
      pageNumber,
      // 任务页码
      taskId,
      // 任务id
      content
      // 任务内容
    })
  })
}

/**
 * @description 修改报告任务信息(社区矫正使用)
 * @return [state]
 */
export function update(obj) {
  return request({
    url: '/community_correction/webClass/clock/update.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      // ...obj,
      ruleId: obj.ruleId,
      ruleName: obj.ruleName,
      period: obj.period,
      startTimes: obj.startTimes,
      endTimes: obj.endTimes
    })
  })
}
