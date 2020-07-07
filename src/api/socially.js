/* eslint-disable no-mixed-spaces-and-tabs */
/**
 * 公益活动管理
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 查询公益活动列表 (社区矫正)
 * @return [list]
 */
export function findActivityList(activityTheme = '', activityLocation = '', pageNumber = 1, pageSize = 7) {
  return request({
    url: '/community_correction/webClass/sociallyUsefulActivity/findActivityList.jhtml',
    method: 'post',
    data: Qs.stringify({
      activityTheme,
      activityLocation,
      pageSize,
      pageNumber
    })
  })
}

/**
 * @description 发布公益活动 (社区矫正)
 * @return [state]
 */
export function add(obj) {
  return request({
    url: '/community_correction/webClass/sociallyUsefulActivity/add.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
		  theme: obj.theme,
		  content: obj.content,
		  location: obj.location,
		  longitude: obj.longitude,
		  latitude: obj.latitude,
		  type: obj.type,
		  startDate: obj.startDate,
		  endDate: obj.endDate,
		  userIds: obj.userIds
    })
  })
}

/**
 * @description 查询矫正对象 (社区矫正)
 * @return [list]
 */
export function findUserList(name = '', phone = '', pageSize = 5, pageNumber = 1) {
  return request({
    url: '/community_correction/webClass/sociallyUsefulActivity/findUserList.jhtml',
    method: 'post',
    data: Qs.stringify({
      name,
      phone,
      pageSize,
      pageNumber
    })
  })
}

/**
 * @description 删除公益活动 (社区矫正)
 * @return [state]
 */
export function deletea(activityId = '') {
  return request({
    url: '/community_correction/webClass/sociallyUsefulActivity/delete.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      activityId
    })
  })
}

/**
 * @description 查询司法所 (社区矫正)
 * @return [list]
 */
export function findJudicial() {
  return request({
    url: '/community_correction/webClass/sociallyUsefulActivity/findJudicial.jhtml',
    method: 'post'
  })
}

/**
 * @description 查询公益活动打卡列表 (社区矫正)
 * @return [list]
 */
export function findEasyClockInList(pageNumber = 1, activityId = '', pageSize = 5) {
  return request({
    url: '/community_correction/webClass/userParticipatePicInfo/findEasyClockInList.jhtml',
    method: 'post',
    data: Qs.stringify({
      activityId,
      pageSize,
      pageNumber
    })
  })
}

/**
 * @description 查询公益活动打卡详情 (社区矫正)
 * @return [list]
 */
export function findClockInListDetail(participateId = '') {
  return request({
    url: '/community_correction/webClass/userParticipatePicInfo/findClockInListDetail.jhtml',
    method: 'post',
    data: Qs.stringify({
      participateId
    })
  })
}

/**
 * @description 公益活动打卡详情审核 (社区矫正)
 * @return [state]
 */
export function findClockInListDetail2(participateId = '', state) {
  return request({
    url: '/community_correction/webClass/userParticipatePicInfo/findClockInListDetail.jhtml',
    method: 'post',
    isShowTips: true,
    data: Qs.stringify({
      participateId,
      state
    })
  })
}
