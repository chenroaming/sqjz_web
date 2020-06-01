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
 * @description 获取矫正人员列表(社区矫正使用)
 * @return [List]
 */
export function getCommunityUserList(name = '', identityCard = '', pageNumber = 1) {
  return request({
    url: '/community_correction/webClass/user/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      name,
      identityCard,
      pageSize: 10,
      pageNumber
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
export function getTrackRecord(userId,date,pageSize = '100', pageNumber = '1') {
  return request({
    url: '/community_correction/webClass/trackRecord/find.jhtml',
    method: 'post',
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
    data: Qs.stringify({adminId})
  })
}

/**
 * @description 新增角色(社区矫正使用)
 * @return [Object]
 */
export function updateAuthority(adminId,authorityCodes) {
  return request({
    url: '/community_correction/webClass/admin/updateAuthority.jhtml',
    method: 'post',
    data: Qs.stringify({adminId,authorityCodes})
  })
}
