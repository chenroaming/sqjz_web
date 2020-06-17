import request from '@/utils/request'
import Qs from 'qs'


/**
 * @description 获取用户列表(社区矫正使用)
 * @return [List]
 */
export function getUserList2(username = '', pageNumber = 1) {
  return request({
    url: '/community_correction/webClass/admin/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      username,
      pageSize: 10,
      pageNumber
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
 * @description 获取矫正人员列表(社区矫正使用)
 * @return [List]
 */
export function getCommunityUserList(name = '', identityCard = '', pageNumber = 1, communityId = '') {
  return request({
    url: '/community_correction/webClass/user/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      name,
      identityCard,
      pageSize: 10,
      pageNumber,
      communityId
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
 * @description 删除矫正人员(社区矫正使用)
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
 * @description 修改矫正人员信息(社区矫正)
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
// export function changeCorrectionalpersonne(userId, name, identityCard, phone, cause, userType, correct = true, activityRange, longitude, latitude,livingArea,remark,picture) {

//   return request({
//     url: '/community_correction/webClass/user/update.jhtml',
//     method: 'post',
//     data: Qs.stringify({
//       userId,
//       name,
//       identityCard,
//       phone,
//       cause,
//       userType,
//       correct,
//       activityRange,
//       longitude,
//       latitude,
//       livingArea,
//       remark,
//       picture,
//     })
//   })
// }
/**
 * @description 修改用户信息(社区矫正使用)
 * @return [Object]
 */
export function changeUser2(adminId, username, name, phone) {
  return request({
    url: '/community_correction/webClass/admin/update.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      adminId,
      username,
      name,
      phone
    })
  })
}

/**
 * @description 修改用户信息(社区矫正使用)
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
export function addUser2(payload) {
  return request({
    url: '/community_correction/webClass/admin/add.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify(payload)
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
    isShowTips: true,
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
 * @description 添加矫正人员文件(社区矫正使用)
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
 * @description 查看矫正人员报告记录(社区矫正使用)
 * @return [list]
 */
export function findRecord(data) {
  return request({
    url: '/community_correction/webClass/clock/findRecord.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

/**
 * @description 查看矫正人员报告记录详情(社区矫正使用)
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
 * @description 矫正人员人脸识别记录(社区矫正使用)
 * @return [list]
 */
export function findRecognitionRecord(data) {
  return request({
    url: '/community_correction/webClass/user/findRecognitionRecord.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}