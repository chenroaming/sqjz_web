/**
 * 获取人脸库信息api
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 获取人脸库列表
 * @return [List]
 */
export function getFaceList(identity = '', facesetName = '', category = '', pageSize = 999, pageNumber = 1) {
  return request({
    url: '/face_recognition/webClass/faceset/findList.jhtml',
    method: 'post',
    data: Qs.stringify({
      identity,
      facesetName,
      category,
      pageSize,
      pageNumber
    })
  })
}

/**
 * @description 删除人脸库列表
 * @return [Object]
 */
export function deleteFace(facesetId) {
  return request({
    url: '/face_recognition/webClass/faceset/delete.jhtml',
    method: 'post',
    data: Qs.stringify({
      facesetId
    })
  })
}

/**
 * @description 修改人脸库信息
 * @return [Object]
 */
export function updateFace(facesetId, facesetName, maxNum, identity, category) {
  return request({
    url: '/face_recognition/webClass/faceset/update.jhtml',
    method: 'post',
    data: Qs.stringify({
      facesetId,
      facesetName,
      maxNum,
      identity,
      category
    })
  })
}

/**
 * @description 新增人脸库信息
 * @return [Object]
 */
export function addFaceLibary(facesetName, maxNum, identity, category, webcamIds = '') {
  webcamIds = webcamIds.join(',')
  return request({
    url: '/face_recognition/webClass/faceset/save.jhtml',
    method: 'post',
    data: Qs.stringify({
      facesetName,
      webcamIds,
      maxNum,
      identity,
      category
    })
  })
}

/**
 * @description 添加用户和规则的关联关系
 * @return [Object]
 */
export function addFaceInfo(data) {
  return request({
    url: '/community_correction/webClass/clock/addRuleToUser.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      ...data
    })
  })
}

/**
 * @description 移除用户和规则的关联关系
 * @return [Object]
 */
export function deleteFaceInfo(data) {
  return request({
    url: '/community_correction/webClass/clock/removeRuleFromUser.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      ...data
    })
  })
}

/**
 * @description 添加/修改 摄像头   获取人脸库列表 ——> type:'all'
  * @description 考勤管理   获取人脸库列表 ——> type:'task'
 * @return [Object]
 */
export function getFacelibaryList(type, identity, facesetName, category) {
  return request({
    url: '/face_recognition/webClass/faceset/getList.jhtml',
    method: 'post',
    data: Qs.stringify({
      type,
      identity,
      facesetName,
      category
    })
  })
}
