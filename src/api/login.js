import request from '@/utils/request'
import Qs from 'qs'
import md5 from 'md5'
export function login(username, password, pinCode) {
  password = md5(password)
  const data = Qs.stringify({
    username,
    password,
    pinCode
  })
  return request({
    url: '/face_recognition/webAdmin/getAuthenticationInfo.jhtml',
    method: 'post',
    data
  })
}
/**
 * 社区矫正平台登录api(社区矫正使用)
 */
export function login2(username, password, pinCode) {
  password = md5(password)
  const data = Qs.stringify({
    username,
    password,
    pinCode
  })
  return request({
    url: '/community_correction/webAdmin/admin/login.jhtml',
    method: 'post',
    isShowTips: true,
    data
  })
}

export function getInfo() {
  return request({
    url: '/community_correction/webClass/admin/getAuthority.jhtml',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/community_correction/webClass/admin/logout.jhtml',
    method: 'post'
  })
}

export function changePassword(old, newPwd) {
  const oldPassword = md5(old)
  const newPassword = md5(newPwd)
  const data = Qs.stringify({
    oldPassword,
    newPassword
  })
  return request({
    url: '/face_recognition/webClass/admin/changePassword.jhtml',
    method: 'post',
    data
  })
}

/**
 * @description 判断验证码
 * @return [List]
 */
export function verifyBlockValidateCode(pinCode) {
  return request({
    url: '/face_recognition/webAdmin/verifyBlockValidateCode.jhtml',
    method: 'post',
    data: Qs.stringify({
      pinCode
    })
  })
}

