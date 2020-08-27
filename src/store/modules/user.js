import { logout, getInfo, login2 } from '@/api/login'
import { setAccount, removeAccount, removeFlag, setLogin, removeSetLogin, removeToken, setroleType, getroleType, removeroleType, setCommunityName, getCommunityName, setAdminName, getAdminName } from '@/utils/auth'
import router from '@/router'
const user = {
  state: {
    name: '',
    avatar: '',
    roles: [],
    roleType: 0,
    // 管理员类型0为其它，1为超级管理员,2为社区管理员
    areaName: '',
    adminName: '',
    communityId: '' // 司法所id
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_AREA: (state, token) => {
      state.areaName = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ADMINNAME: (state, adminName) => {
      state.adminName = adminName
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLE_TYPE: (state, roleType) => {
      state.roleType = roleType
    },
    CHANGE_AREANAME: (state, name) => {
      state.areaName = name
    },
    SET_COMMUNITYID: (state, id) => {
      state.communityId = id
    }
  },

  actions: {
    // 社区矫正平台接口测试
    Login2({ commit, state }, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login2(userInfo).then(response => {
          // console.log('在仓库中调用登录')
          setroleType(response.data.roleType)
          setCommunityName(response.data.communityName)
          setAdminName(response.data.name)
          commit('SET_ROLE_TYPE', response.data.roleType)
          commit('SET_AREA', response.data.communityName)
          commit('SET_ADMINNAME', response.data.name)
          commit('SET_COMMUNITYID', response.data.communityId)
          resolve(response)
          setLogin()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息(社区矫正使用的筛选权限列表)
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const res2 = {
          data: {
            name: '测试环境权限',
            authoritys: []
          }
        }
        getInfo().then(response => {
          if (response.data.state === '100') {
            response.data.authorityCodes && response.data.authorityCodes.length > 0 && commit('SET_ROLES', response.data.authorityCodes)
            const data = res2.data
            // console.log('获取当前人员的角色类型')
            const roleType_res = getroleType()
            commit('SET_ROLE_TYPE', roleType_res)
            const communityName = getCommunityName()
            const adminName = getAdminName()
            commit('SET_NAME', adminName)
            commit('CHANGE_AREANAME', communityName)// 司法所名字
            setAccount(data.name)
            commit('SET_AVATAR', 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png')
            resolve(response)
          } else {
            reject(response)
          }
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          commit('SET_ROLES', [])
          removeAccount()
          removeFlag()
          removeToken()
          removeSetLogin()
          removeroleType()
          resolve()
          location.reload() // 刷新页面重置路由表
          // router.matcher = new Router({
          //   routes: constantRouterMap
          // }).matcher // 重置路由表,此方法有问题，待探究
          // router.$addRoutes() // 新的重置路由方法，同样有问题，待探究
        }).catch(() => {
          // reject(error)
          commit('SET_ROLES', [])
          removeAccount()
          removeFlag()
          removeToken()
          removeSetLogin()
          removeroleType()
          reject()
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_ROLES', [])
        removeAccount()
        removeFlag()
        removeToken()
        removeSetLogin()
        removeroleType()
        resolve()
        // router.$addRoutes()
        location.reload() // 刷新页面重置路由表
      })
    },
    // 变更区域
    ChangeAreaname: ({ commit }) => {
      commit('CHANGE_AREANAME')
    }
  }
}

export default user
