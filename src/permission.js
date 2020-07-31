import router from '@/router'
import store from './store'
// eslint-disable-next-line no-unused-vars
import { Message, TabPane } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getLogin } from '@/utils/auth' // getToken from cookie
import Cookies from 'js-cookie'
// eslint-disable-next-line no-unused-vars
import { debug } from 'util'

NProgress.configure({
  // 绿色进度条
  showSpinner: false
})
// NProgress Configuration
const whiteList = ['/login', '/', '/api', '/index'] // no redirect whitelist
router.beforeEach((to, from, next) => {
  if (getLogin()) {
    NProgress.start() // start progress bar
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          const roles = res.data.authorityCodes // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes', {
            roles
          }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({
              ...to,
              replace: true
            }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || '验证失败，请重新登录')
            next({
              path: '/'
            })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (Cookies.get('flag') === '1') {
      store.dispatch('GetInfo').then(res => { // 拉取user_info
        const roles = res.data.authorityCodes// note: roles must be a array! such as: ['editor','develop']
        store.dispatch('GenerateRoutes', {
          roles
        }).then(() => { // 根据roles权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({
            ...to,
            replace: true
          }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
      }).catch((err) => {
        store.dispatch('FedLogOut').then(() => {
          Message.error(err || '验证失败，请重新登录')
          next({
            path: '/'
          })
        })
      })
      next()
      // eslint-disable-next-line brace-style
    }
    /* has no token*/
    else if (whiteList.includes(to.path)) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
