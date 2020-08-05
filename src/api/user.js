import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 获取用户列表(社区矫正使用)
 * @return [List]
 */
export function getUserList2(username = '', pageNumber = 1, adminId) {
  return request({
    url: '/community_correction/webClass/admin/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      username,
      pageSize: 10,
      pageNumber,
      adminId
    })
  })
}

/**
 * @description 矫正人员解矫(社区矫正使用)
 * @return [List]
 */
export function PersonnelCorrection(userId) {
  return request({
    url: '/community_correction/webClass/user/remove.jhtml',
    method: 'post',
    data: Qs.stringify({
      userId
    })
  })
}

/**
 * @description 获取可查看区域(社区矫正使用)
 * @return [List]
 */
export function getUsercommunity(pageSize = 500) {
  return request({
    url: '/community_correction/webClass/community/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      pageSize
    })
  })
}

/**
 * @description 获取矫正对象列表(社区矫正使用)
 * @return [List]
 */
export function getCommunityUserList(data) {
  return request({
    url: '/community_correction/webClass/user/find.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 获取矫正对象单个详情(社区矫正使用)
 * @return [List]
 */
export function getUserDetail(userId) {
  return request({
    url: '/community_correction/webClass/user/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      userId
    })
  })
}

/**
 * @description 删除用户(社区矫正使用)
 * @return [Object]
 */
export function deleteUser2(adminId) {
  return request({
    url: '/community_correction/webClass/admin/delete.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      adminId
    })
  })
}

/**
 * @description 删除矫正对象(社区矫正使用)
 * @return [Object]
 */
export function delCorrectionalpersonnel(userId) {
  return request({
    url: '/community_correction/webClass/user/delete.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      userId
    })
  })
}

/**
 * @description 修改矫正对象信息(社区矫正)
 * @return [Object]
 */
export function changeCorrectionalpersonne(data) {
  return request({
    url: '/community_correction/webClass/user/update.jhtml',
    method: 'post',
    isShowTips: true,
    data: data
  })
}

/**
 * @description 修改用户信息(社区矫正使用)
 * @return [Object]
 */
export function changeUser2(data) {
  return request({
    url: '/community_correction/webClass/admin/update.jhtml',
    method: 'post',
    isShowTips: true,
    data: data
  })
}

/**
 * @description 查看轨迹记录信息(社区矫正使用)
 * @return [Object]
 */
export function getTrackRecord(userId, date, pageSize = '100', pageNumber = '1') {
  return request({
    url: '/community_correction/webClass/trackRecord/find.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      pageSize,
      pageNumber,
      userId,
      date
    })
  })
}

/**
 * @description 新增角色(社区矫正使用)
 * @return [Object]
 */
export function addUser2(data) {
  return request({
    url: '/community_correction/webClass/admin/add.jhtml',
    method: 'post',
    isShowTips: true,
    data: data
  })
}

/**
 * @description 新增角色(社区矫正使用)
 * @return [Object]
 */
export function findAuthority(adminId) {
  return request({
    url: '/community_correction/webClass/admin/findAuthority.jhtml',
    method: 'post',
    data: Qs.stringify({ adminId })
  })
}

/**
 * @description 新增角色(社区矫正使用)
 * @return [Object]
 */
export function updateAuthority(adminId, authorityCodes) {
  return request({
    url: '/community_correction/webClass/admin/updateAuthority.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({ adminId, authorityCodes })
  })
}

/**
 * @description 添加矫正对象文件(社区矫正使用)
 * @return [state]
 */
export function addFile(data) {
  return request({
    url: '/community_correction/webClass/user/addFile.jhtml',
    method: 'post',
    isShowTips: true,
    data: data
  })
}

/**
 * @description 查看矫正对象报告记录(社区矫正使用)
 * @return [list]
 */
export function findRecord(data) {
  return request({
    url: '/community_correction/webClass/clock/findRecord.jhtml',
    method: 'post',
    noShowTips: true,
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 查看矫正对象报告记录详情(社区矫正使用)
 * @return [list]
 */
export function findRecordDetail(data) {
  return request({
    url: '/community_correction/webClass/clock/findRecordDetail.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 查询书面报告列表(社区矫正使用)
 * @return [list]
 */
export function writtenReportInfo(data) {
  return request({
    url: '/community_correction/webClass/writtenReportInfo/find.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 查看抽查任务记录详情(社区矫正使用)
 * @return [list]
 */
export function reportTask(data) {
  return request({
    url: '/community_correction/webClass/reportTask/findRecord.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 矫正对象人脸识别记录(社区矫正使用)
 * @return [list]
 */
export function findRecognitionRecord(data) {
  return request({
    url: '/community_correction/webClass/user/findRecognitionRecord.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 重置矫正对象手机信息(社区矫正使用)
 * @return [state]
 */
export function resetPhoneInfo(userId) {
  return request({
    url: '/community_correction/webClass/user/resetPhoneInfo.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({ userId })
  })
}

/**
 * @description 获取用户未关联的矫正对象列表(社区矫正使用)
 * @return [list]
 */
export function findUnassociatedList(adminId) {
  return request({
    url: '/community_correction/webClass/user/findUnassociatedList.jhtml',
    method: 'post',
    data: Qs.stringify({ adminId })
  })
}

/**
 * @description 关联矫正对象(社区矫正使用)
 * @return [state]
 */
export function addRelation(data) {
  return request({
    url: '/community_correction/webClass/user/addRelation.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 删除用户与矫正对象的关联关系(社区矫正使用)
 * @return [state]
 */
export function deleteRelation(data) {
  return request({
    url: '/community_correction/webClass/user/deleteRelation.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 矫正对象月度报告(社区矫正使用)
 * @return [list]
 */
export function findMonthlyReport(data) {
  return request({
    url: '/community_correction/webClass/user/findMonthlyReport.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 新增矫正对象(社区矫正使用)
 * @return [list]
 */
export function addUser(data) {
  return request({
    url: '/community_correction/webClass/user/add.jhtml',
    method: 'post',
    isShowTips: true,
    data: data
  })
}

/**
 * @description 矫正对象人脸识别记录(社区矫正使用)
 * @return [list]
 */
export function findRecognitionRecordAdmin(data) {
  return request({
    url: '/community_correction/webClass/admin/findRecognitionRecord.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 解除矫正人员(社区矫正使用)
 * @return [list]
 */
export function remove(data) {
  return request({
    url: '/community_correction/webClass/user/remove.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}
