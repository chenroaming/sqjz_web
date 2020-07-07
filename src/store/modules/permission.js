import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配,原来的人写的方法
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表,原来的人写的方法
 * @param routes asyncRouterMap
 * @param roles
 */
// function filterAsyncRouter(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRouter(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

/**
 * 通过meta.role判断是否与当前用户权限匹配,自己改造的方法，对比之前的哪个更好呢？ by Roaming
 * @param roles
 * @param route
 */
function hasPermission({ meta }, roles) {
  return meta && meta.roles ? roles
    .some(rolesItem => meta.roles
      .includes(rolesItem)) : true
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表,自己改造的方法,对比之前的哪个更好呢？ by Roaming
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const filterArr = routes.filter(route => {
    route.children && route.children.length > 0 && (route.children = filterAsyncRouter(route.children, roles))
    return hasPermission(route, roles)
  })
  return filterArr
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters = []
        if (roles && roles.includes('admin')) { // 超级管理员权限
          accessedRouters = asyncRouterMap
        } else if (roles) { // 除了超级管理员以外的用户权限
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters) // 将权限过滤后进行赋值
        resolve()
      })
    }
  }
}

export default permission
