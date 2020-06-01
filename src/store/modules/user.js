import { login, logout, getInfo, login2 } from '@/api/login'
import { setAccount, removeAccount, removeFlag, setLogin, removeSetLogin, removeToken, setroleType, getroleType, removeroleType,setCommunityName,getCommunityName,setAdminName,getAdminName } from '@/utils/auth'

const user = {
  state: {
    name: '',
    avatar: '',
    roles: [],
    roleType: 0,
    // 管理员类型0为其它，1为超级管理员,2为社区管理员
    areaName: '',
    adminName: '',
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
  },

  actions: {
    // 登录
    // Login({ commit }, userInfo) {
    //   const username = userInfo.username.trim()
    //   return new Promise((resolve, reject) => {
    //     login(username, userInfo.password, userInfo.pinCode).then(response => {
    //       resolve()
    //       setLogin()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 社区矫正平台接口测试
    Login2({ commit, state }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login2(username, userInfo.password, userInfo.pinCode).then(response => {
          console.log('在仓库中调用登录')
          setroleType(response.data.roleType)
          setCommunityName(response.data.communityName)
          setAdminName(response.data.name)
          commit('SET_ROLE_TYPE', response.data.roleType)
          commit('SET_AREA', response.data.communityName)
          commit('SET_ADMINNAME', response.data.name)
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
            // authoritys: ['comprehensive:admin', 'admin:admin', 'device:admin', 'cheliang:admin']
            authoritys:[]
          }
        }
        getInfo().then(response => {
          if (response.data.state == 100){
            response.data.authorityCodes && response.data.authorityCodes.length > 0 && commit('SET_ROLES', response.data.authorityCodes)
            // res2.data.authoritys = response.data.authorityCodes
            const data = res2.data
            // console.log(state.roleType)
            console.log('获取当前人员的角色类型')
            const roleType_res = getroleType()
            const communityName = getCommunityName()
            const adminName = getAdminName()
            commit('SET_NAME', adminName)
            commit('CHANGE_AREANAME',communityName);//司法所名字
            // console.log(roleType_res)
            // switch (roleType_res) {
            //   case '1':
            //     res2.data.authoritys = ['Communityuser:admin', 'attendance:admin', 'jifen:admin', 'comprehensive: admin', 'comprehensive: admin2', 'xitong:admin', 'xitong:admin1']
            //     // commit('SET_NAME', '超级管理员')
            //     break
            //   case '2':
            //     res2.data.authoritys = ['Communityuser:admin', 'attendance:admin', 'jifen:admin', 'comprehensive: admin', 'comprehensive: admin2', 'xitong:admin', 'xitong:admin1']
            //     // commit('SET_NAME', '省级管理员')
            //     break
            //   case '3':
            //     res2.data.authoritys = ['Communityuser:admin', 'attendance:admin', 'jifen:admin', 'comprehensive: admin', 'comprehensive: admin2', 'xitong:admin', 'xitong:admin1']
            //     // commit('SET_NAME', '市级管理员')
            //     break
            //   case '4':
            //     res2.data.authoritys = ['Communityuser:admin', 'attendance:admin', 'jifen:admin', 'comprehensive: admin', 'comprehensive: admin2', 'xitong:admin', 'xitong:admin1']
            //     // commit('SET_NAME', '区级管理员')
            //     break
            //   case '5':
            //     res2.data.authoritys = ['Communityuser:admin', 'attendance:admin', 'jifen:admin', 'comprehensive: admin', 'xitong:admin']
            //     // commit('SET_NAME', '司法所管理员')
            //     break
            //   case '6':
            //     res2.data.authoritys = ['Communityuser:admin', 'attendance:admin', 'jifen:admin', 'comprehensive: admin']
            //     // commit('SET_NAME', '司法人员')
            //     break
            // }
            setAccount(data.name)
            commit('SET_AVATAR', 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png')
          }
          resolve(response)
        })
      })
    },
    // 测试获取用户信息2(原来使用的)
    // GetInfo2({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo().then(response => {
    //       console.log('在仓库获取用户信息')
    //       console.log(response)
    //       const data = response.data
    //       setAccount(data.name)
    //       if (data.authoritys && data.authoritys.length > 0) { // 验证返回的roles是否是一个非空数组
    //         commit('SET_ROLES', data.authoritys)
    //       } else {
    //         reject('getInfo: roles must be a non-null array !')
    //       }
    //       commit('SET_NAME', data.name)
    //       commit('SET_ROLE_TYPE', data.roleType)
    //       // commit('SET_AREA', data.areaName)
    //       commit('SET_AVATAR', 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png')
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          console.log(res)
          commit('SET_ROLES', [])
          removeAccount()
          removeFlag()
          removeToken()
          removeSetLogin()
          removeroleType()
          resolve()
        }).catch(() => {
          // reject(error)
          commit('SET_ROLES', [])
          removeAccount()
          removeFlag()
          removeToken()
          removeSetLogin()
          removeroleType()
          resolve()
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
        resolve()
      })
    },
    // 变更区域
    ChangeAreaname: ({ commit }) => {
      commit('CHANGE_AREANAME')
    }
  }
}

export default user
