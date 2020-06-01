/**
 * 获取设备信息api
 */
import request from '@/utils/request'
import Qs from 'qs';

/**
 * @description 获取设备列表
 * @return [List]
 */
export function getDeviceList(deviceName = '', deviceNumber = '', deviceType = null, deviceVersion = '', deviceKind = '', pageSize = 10, pageNumber = 1) {
  return request({
    url: '/face_recognition/webClass/device/findList.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceName,
      deviceNumber,
      deviceType,
      deviceVersion,
      deviceKind,
      pageSize,
      pageNumber
    })
  })
}

/**
 * @description 删除设备
 * @return [List]
 */
export function deleteDevice(deviceId) {
  return request({
    url: '/face_recognition/webClass/device/delete.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceId,
    })
  })
}

/**
 * @description 删除设备数据
 * @return [List]
 */
export function wipeData(deviceNumber, isDelete = true, allOrNot) {
  return request({
    url: '/face_recognition/webClass/device/wipeData.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceNumber,
      isDelete,
      allOrNot
    })
  })
}

/**
 * @description 新增设备
 * @return [List]
 */
export function addDevice(deviceName, deviceNumber, deviceType, deviceVersion, deviceKind) {
  return request({
    url: '/face_recognition/webClass/device/save.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceName,
      deviceNumber,
      deviceType,
      deviceVersion,
      deviceKind,
    })
  })
}


/**
 * @description 修改设备
 * @return [List]
 */
export function updateDevice(deviceName, deviceNumber, deviceType, deviceVersion, deviceKind, deviceId) {
  return request({
    url: '/face_recognition/webClass/device/update.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceName,
      deviceNumber,
      deviceType,
      deviceVersion,
      deviceKind,
      deviceId,
    })
  })
}


/**
 * @description 获取设备绑定人脸
 * @return [List]
 */
export function getDeviceFaceList(deviceNumber, pageSize = 10, pageNumber = 1) {
  return request({
    url: '/face_recognition/webClass/device/findFaceList.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceNumber,
      pageSize,
      pageNumber,
    })
  })
}

/**
 * @description 获取设备绑定摄像头
 * @return [List]
 */
export function getDeviceCamList(deviceNumber, pageSize = 10, pageNumber = 1) {
  return request({
    url: '/face_recognition/webClass/device/findWebcamList.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceNumber,
      pageSize,
      pageNumber,
    })
  })
}


/**
 * @description 新增设备摄像头
 * @return [List]
 */
export function addDeviceWebcam(deviceNumber, webcamName, rtspAddress) {
  return request({
    url: '/face_recognition/webClass/device/saveWebcam.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceNumber,
      webcamName,
      rtspAddress,
    })
  })
}


/**
 * @description 修改摄像头信息
 * @return [List]
 */
export function updateDeviceCam(webcamId, webcamName, rtspAddress) {
  return request({
    url: '/face_recognition/webClass/device/updateWebcam.jhtml',
    method: 'post',
    data: Qs.stringify({
      webcamId,
      webcamName,
      rtspAddress
    })
  })
}


/**
 * @description 获取设备的人脸列表
 * @return [List]
 */
export function getDeviceImageList(deviceNumber, pageSize, pageNumber, name) {
  return request({
    url: '/face_recognition/webClass/device/findFaceList.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceNumber,
      pageSize,
      pageNumber,
      name
    })
  })
}


/**
 * @description 删除设备人脸
 * @return [List]
 */
export function deleteDeviceFace(faceId) {
  return request({
    url: '/face_recognition/webClass/device/deleteUser.jhtml',
    method: 'post',
    data: Qs.stringify({
      faceId,
    })
  })
}


/**
 * @description 修改设备人脸信息
 * @return [List]
 */
export function updateDeviceFace(faceId, name, category) {
  return request({
    url: '/face_recognition/webClass/device/updateUser.jhtml',
    method: 'post',
    data: Qs.stringify({
      faceId,
      name,
      category,
    })
  })
}

/**
 * @description 新增设备人脸
 * @return [List]
 */
export function addDeviceFace(payload) {
  return request({
    url: '/face_recognition/webClass/device/saveUser.jhtml',
    method: 'post',
    data: payload,
  })
}


/**
 * @description 删除设备人脸图片
 * @return [List]
 */
export function deleteDeviceFaceImage(faceId, featureId) {
  return request({
    url: '/face_recognition/webClass/device/deleteUserPic.jhtml',
    method: 'post',
    data: Qs.stringify({
      faceId,
      featureId,
    })
  })
}

/**
 * @description 修改设备人脸照片
 * @return [List]
 */
export function updateDeviceFaceImage(formData) {
  return request({
    url: '/face_recognition/webClass/device/updateUserPic.jhtml',
    method: 'post',
    data: formData
  })
}


/**
 * @description 新增设备人脸照片
 * @return [List]
 */
export function addDeviceFaceImage(formData) {
  return request({
    url: '/face_recognition/webClass/device/saveUserPic.jhtml',
    method: 'post',
    data: formData
  })
}


/**
 * @description 新增设备人脸照片-批量
 * @return [List]
 */
export function addDeviceFaceImageMuti(faceIds, deviceNumbers) {
  return request({
    url: '/face_recognition/webClass/device/addFaceToDevice.jhtml',
    method: 'post',
    data: Qs.stringify({
      faceIds,
      deviceNumbers,
    })
  })
}

/**
 * @description 将设备中的人脸批量添加到平台-批量
 * @return [List]
 */
export function addFaceToPlatform(faceIds, deviceNumbers) {
  return request({
    url: '/face_recognition/webClass/device/addFaceToPlatform.jhtml',
    method: 'post',
    data: Qs.stringify({
      faceIds,
      deviceNumbers,
    })
  })
}


/**
 * @description 获取设备列表（设备检测页面）
 * @return [List]
 */
export function getEquipmentList(pageNumber, pageSize, deviceNumber, deviceName) {
  return request({
    url: '/face_recognition/web/systemParm/getDeviceStateList.jhtml',
    method: 'post',
    data: Qs.stringify({
      pageNumber,
      pageSize,
      deviceName,
      deviceNumber
    })
  })
}

/**
 * @description 查询视频流列表（实时视频页面）
 * @return [List]
 */
export function getVideoList(pageNumber, pageSize, deviceNumber, deviceName, webCamName) {
  return request({
    url: '/face_recognition/web/ipc/getVideoList.jhtml',
    method: 'post',
    data: Qs.stringify({
      pageNumber,
      pageSize,
      deviceName,
      deviceNumber,
      webCamName
    })
  })
}


/**
 * @description 删除设备中的摄像头
 * @params {string} [webcamId] 摄像头ID
 * @return [object] [res]
 */
export function deleteDeviceWebcam(webcamId) {
  return request({
    url: '/face_recognition/webClass/webcam/delete.jhtml',
    method: 'post',
    data: Qs.stringify({
      webcamId
    })
  })
}

/**
 * @description 删除设备中的摄像头
 * @params {number} [deviceNumber] 设备号
 * @return [list]
 */
export function deviceStateCount(deviceNumber) {
  return request({
    url: '/face_recognition/web/deviceStateCount/getDeviceStateList.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceNumber
    })
  })
}

/**
 * @description 更换设备
 * @params {number} [oldDeviceNumber] 旧设备号
 * @params {number} [newDeviceNumber] 新设备号
 * @params {face} [newDeviceNumber] 是否人脸
 * @params {webcam} [newDeviceNumber] 是否摄像头
 * @return [list]
 */
export function changeDevice(oldDeviceNumber, newDeviceNumber, face = '', webcam = '') {
  return request({
    url: '/face_recognition/webClass/device/changeDevice.jhtml',
    method: 'post',
    data: Qs.stringify({
      oldDeviceNumber,
      newDeviceNumber,
      face,
      webcam
    })
  })
}

/**
 * @description 播放视频
 */
export function startShowVideo(webCamId) {
  return request({
    url: '/face_recognition/video/startShowVideo.jhtml',
    method: 'post',
    data: Qs.stringify({
      webCamId
    })
  })
}

/**
 * @description 播放视频
 */
export function stopShowVideo(webCamId) {
  return request({
    url: '/face_recognition/video/stopShowVideo.jhtml',
    method: 'post',
    data: Qs.stringify({
      webCamId
    })
  })
}

/**
 * @description 获取设备版本列表
 */
export function getVersion(deviceType) {
  return request({
    url: '/face_recognition/webClass/deviceRemoteUpdate/findFileList.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceType
    })
  })
}

/**
 * @description 更新设备
 */
export function updateDeviceVersion(versionId, deviceNumber) {
  return request({
    url: '/face_recognition/webClass/deviceRemoteUpdate/update.jhtml',
    method: 'post',
    data: Qs.stringify({
      versionId,
      deviceNumber,
      
    })
  })
}

/**
 * @description 版本更新获取版本列表
 */
export function deviceRemoteUpdate(deviceType, pageSize, pageNumber) {
  return request({
    url: '/face_recognition/webClass/deviceRemoteUpdate/findList.jhtml',
    method: 'post',
    data: Qs.stringify({
      deviceType,
      pageSize,
      pageNumber
    })
  })
}

/**
 * @description 获取版本更新记录列表
 */
export function deviceRemoteUpdateFindList(versionId, pageSize, pageNumber) {
  return request({
    url: '/face_recognition/webClass/deviceRemoteUpdate/findRecordList.jhtml',
    method: 'post',
    data: Qs.stringify({
      versionId,
      pageSize,
      pageNumber
    })
  })
}

// /**
//  * @description 更新设备
//  */
// export function updateDevice(deviceName, deviceNumber, deviceType,deviceVersion,deviceKind) {
//   return request({
//     url: '/face_recognition/webClass/device/update.jhtml',
//     method: 'post',
//     data: Qs.stringify({
//       deviceName,
//       deviceNumber,
//       deviceType,
//       deviceVersion,
//       deviceKind
//     })
//   })
// }