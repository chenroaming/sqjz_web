import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
// eslint-disable-next-line no-unused-vars
// import { getAccount } from '@/utils/auth'

axios.defaults.withCredentials = true
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 20000, // 请求超时时间
  withCredentials: true // 客户端允许携带证书
})
let showTips = false//弹窗消息开关
// request拦截器
service.interceptors.request.use(
  config => {
    config.isShowTips && (showTips = true)//当接口的弹窗消息指示为true时，开关打开
    // config.headers['X-Token'] = getAccount() // 让每个请求携带自定义token 请根据实际情况自行修改
    return config//当定义config时，需要返回config，否则会报错cancelToken未定义
  },
  // error => {
  //   // Do something with request error
  //   console.log(error) // for debug
  //   Promise.reject(error)
  // }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (showTips){//根据开关进行相应弹窗
      res.state == 100 ? Message({
        message: res.message,
        type: 'success',
        duration: 3 * 1000
      }) : Message({
        message: res.message,
        type: 'warning',
        duration: 3 * 1000
      })
      showTips = false
    }
    if (res.state == 100) {
      return response
    } else if (res.state === '105') {
      // 105: 登录过期;
      MessageBox.confirm(
        res.message,
        '确定登出', {
          confirmButtonText: '重新登录',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
      // return Promise.reject('error')
    } else {
      Message({
        message: res.message,
        type: 'warning',
        duration: 3 * 1000
      })
    }
    return response
  },
  error => {
    // console.log('err' + error) // for debug
    Message({
      message: '网络错误，请刷新重试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service