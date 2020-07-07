/**
 * 获取人脸列表api
 */
import request from '@/utils/face_requset'
import Qs from 'qs'

/**
 * @description 查看规则关联或未关联的人脸列表
 * @return [List]
 */
export function getFaceList(type = '', ruleId = '', pageSize = 10, pageNumber = 1, name = '') {
  return request({
    url: '/community_correction/webClass/clock/findUserList.jhtml',
    method: 'post',
    data: Qs.stringify({
      type,
      ruleId,
      pageSize,
      pageNumber,
      name
    })
  })
}

