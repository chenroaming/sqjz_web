import axios from 'axios'
axios.defaults.withCredentials = true
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 20000, // 请求超时时间
  withCredentials: true // 客户端允许携带证书
})

/**
 * @description 获取API接口列表
 * @return [List]
 */
export function getApiList() {
  return service({
    url: '/face_recognition/webAdmin/API/APIList.jhtml',
    method: 'post'
  })
}

/**
 * @description 获取接口详情
 * @return [List]
 */
export function getApiDetail(params) {
  return service({
    url: '/face_recognition/webAdmin/API/findAPI.jhtml',
    method: 'post',
    params
  })
}
