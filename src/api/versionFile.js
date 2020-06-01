/**
 * app信息
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 更新app (社区矫正)
 * @return [List]
 */
export function versionFile(data) {
  return request({
    url: '/community_correction/webClass/versionFile/add.jhtml',
    method: 'post',
    data: data
  })
}

/**
 * @description 获取app信息 (社区矫正)
 * @return [List]
 */
export function find() {
  return request({
    url: '/community_correction/webAdmin/versionFile/find.jhtml',
    method: 'post',
  })
}