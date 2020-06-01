import axios from 'axios'
// 引入axios
import { Message, MessageBox } from 'element-ui'
// 引入提示
axios.defaults.withCredentials = true
// 创建axios实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:18889',
  timeout: 20000, // 请求超时时间
  withCredentials: false // 客户端允许携带证书
})

// response 拦截器
service.interceptors.response.use(
  response => {
    console.log(process.env.BASE_API)
    const res = response.data

    if (res.state === '100' || res.state === 100 || res.resultFlag === 0 || res.resultFlag === -1) {
      return response
      // alert('成功')
    } else {
      //   return '错误'
      Message({
        message: '请先安装插件,或插件未打开',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  error => {
    Message({
      message: '请先安装插件,或插件未打开',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
