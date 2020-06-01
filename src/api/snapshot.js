/**
 * 获取抓拍记录api
 */
import request from '@/utils/request'
// eslint-disable-next-line semi
import Qs from 'qs';



/**
 * @description 获取查看轨迹记录列表(社区矫正)
 * @return [List]
 */
export function getSnapShotList2(pageSize = 10, pageNumber = 1, userId = '', name = '', deviate) {
  return request({
    url: '/community_correction/webClass/trackRecord/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      userId,
      pageSize,
      pageNumber,
      name
    })
  })
}


