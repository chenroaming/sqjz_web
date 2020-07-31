<script>
import snippets from './snippets'
export default {
  name: 'Test',
  components: { snippets },
  data() {
    return {
      value: '',
      testName: 'zhangsan',
      asyncRouterMap: [
        {
          path: '/Communityuser',
          redirect: '/Communityuser/index',
          meta: {
            title: '矫正电子档案',
            icon: 'community',
            roles: ['user:admin']
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/Communityuser/index'), // Parent router-view
              name: 'screen-manger',
              children: [
                {
                  path: 'areacounts',
                  hidden: true,
                  component: () => import('@/views/attendance/area/count/count'), // Parent router-view
                  name: 'area-counts',
                  meta: {
                    title: '打卡记录1',
                    roles: ['user:admin111']
                  },
                  children: [
                    {
                      path: 'areacounts',
                      hidden: true,
                      component: () => import('@/views/attendance/area/count/count'), // Parent router-view
                      name: 'area-counts',
                      meta: {
                        title: '打卡记录3',
                        roles: ['user:admin']
                      }
                    },
                    {
                      path: 'areacounts',
                      hidden: true,
                      component: () => import('@/views/attendance/area/count/count'), // Parent router-view
                      name: 'area-counts',
                      meta: {
                        title: '打卡记录311',
                        roles: ['user:admin']
                      }
                    }
                  ]
                },
                {
                  path: 'areacounts',
                  hidden: true,
                  component: () => import('@/views/attendance/area/count/count'), // Parent router-view
                  name: 'area-counts',
                  meta: {
                    title: '打卡记录2',
                    roles: ['user:admin']
                  }
                }
              ],
              meta: {
                title: '矫正电子档案',
                roles: ['user:admin']
              }
            },
            {
              path: 'areacounts',
              hidden: true,
              component: () => import('@/views/attendance/area/count/count'), // Parent router-view
              name: 'area-counts',
              meta: {
                title: '打卡记录',
                roles: ['user:admin']
              }
            },
            {
              path: 'changeUser',
              hidden: true,
              component: () => import('@/views/Communityuser/changeUser/index'), // Parent router-view
              name: 'change-user',
              meta: {
                title: '修改信息',
                roles: ['user:admin']
              }
            }
          ]
        },
        {
          path: '/Relation',
          redirect: '/Relation/index',
          meta: {
            title: '矫正对象分组',
            icon: 'example',
            roles: ['user:admin']
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/Relation/index'), // Parent router-view
              name: 'relation-group',
              meta: {
                title: '矫正对象分组',
                roles: ['user:admin']
              }
            }
          ]
        },
        {
          path: '/record',
          redirect: '/record/normal',
          meta: {
            title: '报告任务管理',
            icon: 'camera',
            roles: ['clock:admin']
          },
          children: [
            {
              path: 'area',
              component: () => import('@/views/attendance/area/index'),
              name: 'area-manger',
              meta: {
                title: '报告任务管理',
                roles: ['clock:admin']
              }
            }
          ]
        },
        {
          path: '/warningInfo',
          redirect: '/warningInfo/index',
          meta: {
            title: '预警信息管理',
            icon: 'eye-open',
            roles: ['warningInfo:admin']
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/warningInfo/index'), // Parent router-view
              name: 'warningInfo',
              meta: {
                title: '预警信息管理',
                roles: ['warningInfo:admin']
              }
            }
          ]
        },
        {
          path: '/interviewRecord',
          redirect: '/interviewRecord/index',
          meta: {
            title: '走访记录管理',
            icon: 'meeting',
            roles: ['interviewRecord:admin']
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/interviewRecord/index'), // Parent router-view
              name: 'interviewRecord',
              meta: {
                title: '走访记录管理',
                roles: ['interviewRecord:admin']
              }
            }
          ]
        },
        {
          path: '/socially',
          redirect: '/socially/index',
          meta: {
            title: '公益活动管理',
            icon: 'visitor',
            roles: ['sociallyUsefulActivity:admin']
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/socially/index'), // Parent router-view
              name: 'sociallyIndex',
              meta: {
                title: '公益活动管理',
                roles: ['sociallyUsefulActivity:admin']
              }
            }
          ]
        },
        {
          path: '/productInfo',
          redirect: '/productInfo/index',
          meta: {
            title: '商品管理',
            icon: 'snapshot',
            roles: ['productInfo:admin']
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/productInfo/productInfo'), // Parent router-view
              name: 'productInfoIndex',
              meta: {
                title: '商品管理',
                roles: ['productInfo:admin']
              }
            }
          ]
        },
        {
          path: '/educationInfo',
          redirect: '/educationInfo/index',
          meta: {
            title: '教育管理',
            icon: 'schoolmsg',
            roles: ['educationInfo:admin']
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/educationInfo/educationInfo'), // Parent router-view
              name: 'educationInfoIndex',
              meta: {
                title: '教育管理',
                roles: ['educationInfo:admin']
              }
            }
          ]
        },
        {
          path: '/application',
          redirect: '/application/index',
          meta: {
            title: '事项申请管理',
            icon: 'device',
            roles: ['application:admin']
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/application/index'), // Parent router-view
              name: 'applicationIndex',
              meta: {
                title: '事项申请管理',
                roles: ['application:admin']
              }
            }
          ]
        },
        {
          path: '/system',
          alwaysShow: true,
          redirect: '/system/usermanger',
          meta: {
            title: '系统管理',
            icon: 'user',
            roles: ['system:admin']
          },
          children: [{
            path: 'usermanger',
            component: () => import('@/views/usermanger/index'), // Parent router-view
            name: 'usermanger',
            icon: 'user',
            meta: {
              title: '账号管理',
              roles: ['admin:admin']
            }
          },
          {
            path: 'admin_community',
            component: () => import('@/views/admin_community/admin_community'), // Parent router-view
            name: 'admin-community',
            meta: {
              title: '区域管理',
              roles: ['community:admin']
            }
          },
          {
            path: 'role',
            component: () => import('@/views/role/index'), // Parent router-view
            name: 'role-manger',
            meta: {
              title: '角色管理',
              roles: ['role:admin']
            }
          },
          {
            path: 'index',
            component: () => import('@/views/versionFile/index'), // Parent router-view
            name: 'versionFile',
            meta: {
              title: 'App更新管理',
              roles: ['versionFile:admin']
            }
          }
          ]
        }
      ],
      auth: ['user:admin']
      // auth: ['sysmanage:admin', 'system:admin', 'admin:admin', 'admin:operate', 'admin:find', 'user:admin']
    }
  },
  mounted() {

  },
  methods: {
    test() {
      console.log(this.filterRouter(this.asyncRouterMap, this.auth))
    },
    test2() {
      this.$refs.snippets.show()
      this.testName = 'wangwu'
      this.$refs.snippets.show()
    },
    firstCheckPermisson({ meta }, roles) {
      return meta && meta.roles ? roles
        .some(rolesItem => meta.roles
          .includes(rolesItem)) : true
      // if (meta && meta.roles) {
      //   return roles
      //     .some(rolesItem => meta.roles
      //       .includes(rolesItem))
      // } else {
      //   return true
      // }
    },
    filterRouter(routes, roles) {
      const filterArr = routes.filter(route => {
        route.children && route.children.length > 0 && (route.children = this.filterRouter(route.children, this.auth))
        return this.firstCheckPermisson(route, this.auth)
      })
      return filterArr
      // const filterArr = []
      // routes.forEach(route => {
      //   const newRoute = { ...route }
      //   if (this.firstCheckPermisson(route, this.auth)) {
      //     newRoute.children = []
      //     if (route.children && route.children.length > 0) {
      //       newRoute.children = this.filterRouter(route.children, this.auth)// 递归将具有children数据的权限进行判断处理
      //     }
      //     filterArr.push(newRoute)
      //   }
      // })
      // return filterArr
    }
  }
}
</script>

<template>
  <div>
    <el-button type="primary" @click="test">测试</el-button>
    <el-button type="primary" @click="test2">测试2</el-button>
    <snippets ref="snippets" :test-name="testName"/>
  </div>
</template>

