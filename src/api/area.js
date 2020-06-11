/**
 * 获取区域信息api
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 获取区域列表(社区矫正使用)
 * @return [List]
 */
export function getAreaList2(areaName = '', pageSize = 10, pageNumber = 1) {
  return request({
    url: '/community_correction/webClass/community/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      areaName,
      pageSize,
      pageNumber
    })
  })
}

/**
 * @description 删除区域
 * @return [List]
 */
export function deleteArea2(communityId = '') {
  return request({
    url: '/community_correction/webClass/community/delete.jhtml',
    method: 'post',
    isShowTips:true,
    data: Qs.stringify({
      communityId
    })
  })
}


/**
 * @description 新增
 * @return [List]
 */
export function addArea2(communityName = '', longitude, latitude, radius = '2000') {
  return request({
    url: '/community_correction/webClass/community/add.jhtml',
    method: 'post',
    isShowTips:true,
    data: Qs.stringify({
      communityName,
      longitude,
      latitude,
      radius
    })
  })
}
