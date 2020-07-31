import Mock from 'mockjs'
import visualApi from './visualApi'
// Mock.mock('/community_correction/webClass/user/find.jhtml', 'post', (params) => {
//   const [, pageNumber] = params.body
//     .split('&')
//     .find(item => item.includes('pageNumber'))
//     .split('=')
//   return visualApi.loginOut
// })

Mock.mock('/community_correction/webClass/user/remove.jhtml', 'post', (params) => {
  return visualApi.removeSuccess
})
