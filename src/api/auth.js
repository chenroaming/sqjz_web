/**
 * 获取权限信息api
 */
import request from '@/utils/request'
import Qs from 'qs';

/**
 * @description 获取权限列表
 * @return [List]
 */
export function getAuthList() {
  return request({
    url: '/face_recognition/webClass/authority/findList.jhtml',
    method: 'post',
  })
}


/**
 * @description 修改权限
 * @return [List]
 */
export function changeAuth(authorityId, authorityName, authorityCode, authorityUrl = '') {
  return request({
    url: '/face_recognition/webClass/authority/update.jhtml',
    method: 'post',
    isShowTips:true,
    data: Qs.stringify({
      authorityId,
      authorityName,
      authorityCode,
      authorityUrl,
    })
  })
}


/**
 * @description 删除权限
 * @return [List]
 */
export function deleteAuth(authorityId) {
  return request({
    url: '/face_recognition/webClass/authority/delete.jhtml',
    method: 'post',
    isShowTips:true,
    data: Qs.stringify({
      authorityId,
    })
  })
}


/**
 * @description 新增权限
 * @return [List]
 */
export function addAuth(authorityName, authorityCode, parentId, authorityUrl) {
  return request({
    url: '/face_recognition/webClass/authority/save.jhtml',
    method: 'post',
    isShowTips:true,
    data: Qs.stringify({
      authorityName,
      authorityCode,
      parentId,
      authorityUrl,
    })
  })
}