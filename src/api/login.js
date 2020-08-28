import request from '@/utils/request'
import Qs from 'qs'
import md5 from 'md5'
import { stringify } from 'querystring'
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
export function login2(data) {
  const params = {
    ...data,
    password: md5(data.password)
  }
  return request({
    url: '/community_correction/webAdmin/admin/login.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({ ...params })
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

export function changePassword(oldPassword, newPassword) {
  return request({
    url: '/community_correction/webClass/admin/changePassword.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      oldPassword,
      newPassword
    })
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

/**
 * @description 获取验证码
 * @return [src]
 */
export function validateCode() {
  return request({
    noShowTips: true,
    url: '/community_correction/webAdmin/admin/validateCode.jhtml',
    method: 'post'
  })
}

/**
 * @description 判断滑块验证码
 * @return [List]
 */
export function verifyValidateCode(pinCode) {
  return request({
    url: '/community_correction/webAdmin/admin/verifyValidateCode.jhtml',
    method: 'post',
    data: Qs.stringify({
      pinCode
    })
  })
}
