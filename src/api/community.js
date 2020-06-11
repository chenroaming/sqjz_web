/**
 * 区域管理api
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 获取司法所列表（已完成）
 * @return [List]
 */
export function getcommunity(pageSize = '10', pageNumber = '1', communityName = '') {
  return request({
    url: '/community_correction/webClass/community/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      pageSize,
      pageNumber,
      communityName
    })
  })
}

/**
 * @description 联动获取全部区域列表（包含父级\子级区域)
 * @return [List]
 */
export function getallcommunity() {
  return request({
    url: '/community_correction/webClass/community/findList.jhtml',
    method: 'post',
    data: Qs.stringify({

    })
  })
}

/**
 * @description 创建区域（社区矫正）
 * @return [List]
 */
export function addcommunity(communityId, communityName) {
  return request({
    url: '/community_correction/webClass/community/add.jhtml',
    method: 'post',
    isShowTips:true,
    data: Qs.stringify({
      communityId,
      communityName
    })
  })
}

/**
 * @description 删除区域（社区矫正）
 * @return [List]
 */
export function delcommunity(communityId) {
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
 * @description 删除区域（社区矫正）
 * @return [List]
 */
export function update(communityId,communityName) {
  return request({
    url: '/community_correction/webClass/community/update.jhtml',
    method: 'post',
    isShowTips:true,
    data: Qs.stringify({
      communityId,communityName
    })
  })
}