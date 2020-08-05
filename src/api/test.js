
import request from '@/utils/request'
import Qs from 'qs'

/**
 * @description 测试数组传输接口 (社区矫正)
 * @return [list]data
 */
export function arrayTest(data) {
  return request({
    url: 'http://chc.zonelian.net/test',
    method: 'post',
    data: Qs.stringify({
      ...data
    })
  })
}
