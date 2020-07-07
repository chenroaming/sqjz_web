import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
// eslint-disable-next-line no-unused-vars
import { getAccount } from '@/utils/auth'

axios.defaults.withCredentials = true
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 20000, // 请求超时时间
  withCredentials: true // 客户端允许携带证书
})

// request拦截器
service.interceptors.request.use(
  // config => {
  //   config.headers['X-Token'] = getAccount() // 让每个请求携带自定义token 请根据实际情况自行修改
  //   return config
  // },
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
    if (res.state === '100' || res.state === 100 || res.resultFlag === 0 || res.resultFlag === -1) {
      return response
      // alert('成功')
    } else {
      // 105: 登录过期;
      if (res.state === '105') {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出', {
            confirmButtonText: '重新登录',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else {
        // Message({
        //     message: res.message,
        //     type: 'error',
        //     duration: 5 * 1000
        // })
      }
      // return response
      return Promise.reject('error')
    }
  },
  error => {
    // console.log('err' + error) // for debug
    // Message({
    //     message: error.message,
    //     type: 'error',
    //     duration: 5 * 1000
    // })
    // Message({
    //   message: '错误',
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
