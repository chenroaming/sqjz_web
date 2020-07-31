import Vue from 'vue'
import VueRouter from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(VueRouter)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/

export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/Visualization',
    component: () => import('@/views/Visualization'),
    hidden: true
  },
  {
    path: '/index',
    component: () => import('@/views/introduce'),
    hidden: true
  },
  {
    path: '/test',
    component: () => import('@/views/test/tree'),
    hidden: true,
    children: [
      {
        path: '/test/children1',
        name: 'children1',
        component: () => import('@/views/test/children/children1')
      },
      {
        path: '/test/children2',
        name: 'children2',
        component: () => import('@/views/test/children/children2')
      }
    ]
  },
  {
    path: '/test2',
    component: () => import('@/views/test/test'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home/index',
    hidden: true,
    children: [
      {
        path: '/home/index',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: {
          title: '主页',
          icon: 'example',
          breadcrumb: false
        }
      }
    ]
  }
]

export const asyncRouterMap = [
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    meta: {
      title: '首页',
      icon: 'more'
      // roles: ['Communityuser:admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/home/index'), // Parent router-view
        name: 'screen-manger',
        meta: {
          title: '首页'
          // roles: ['Communityuser:admin']
        }
      }
    ]
  },
  {
    path: '/Communityuser',
    component: Layout,
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
        meta: {
          title: '在矫人员',
          roles: ['user:admin']
        }
      },
      {
        path: 'CorrectionPersonnel',
        component: () => import('@/views/Communityuser/CorrectionPersonnel/index'), // Parent router-view
        name: 'screen-CorrectionPersonnel',
        meta: {
          title: '解矫人员',
          roles: ['user:admin']
        }
      },
      {
        path: 'areacounts',
        hidden: true,
        component: () => import('@/views/attendance/area/count/count'), // Parent router-view
        name: 'area-counts',
        meta: {
          title: '打卡记录'
        }
      },
      {
        path: 'changeUser',
        hidden: true,
        component: () => import('@/views/Communityuser/changeUser/index'), // Parent router-view
        name: 'change-user',
        meta: {
          title: '修改信息'
        }
      }
    ]
  },
  {
    path: '/Relation',
    component: Layout,
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
    component: Layout,
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
    component: Layout,
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
    component: Layout,
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
    component: Layout,
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
    component: Layout,
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
    component: Layout,
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
    component: Layout,
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
    path: '/changepwd',
    redirect: '/changepwd/changepwd',
    component: Layout,
    meta: {
      title: '修改密码'
    },
    children: [{
      path: 'changepwd',
      name: 'changepwd',
      component: () => import('@/views/changepwd/index'),
      meta: {
        title: '修改密码'
      },
      hidden: true
    }],
    hidden: true
  },
  // {
  //   // 社区矫正
  //   path: '/snapshot',
  //   component: Layout,
  //   redirect: '/snapshot/manger',
  //   meta: {
  //     title: '轨迹管理',
  //     icon: 'snapshot'
  //   },
  //   children: [{
  //     path: 'manger',
  //     component: () => import('@/views/snapshot/index'), // Parent router-view
  //     name: 'snapshotmanger',
  //     meta: {
  //       title: '轨迹列表'
  //     }
  //   }
  //   ]
  // },
  // 社区矫正(积分任务管理)
  // {
  //   path: '/snapshot',
  //   component: Layout,
  //   name: 'snapshot',
  //   redirect: '/snapshot/normal',
  //   meta: {
  //     title: '积分任务管理',
  //     icon: 'snapshot',
  //     roles: ['jifen:admin']
  //   },
  //   children: [
  //     {
  //       path: 'normal',
  //       component: () => import('@/views/Integraltask/Integraltask'),
  //       name: 'normal-manger',
  //       meta: {
  //         title: '积分任务管理',
  //         roles: ['jifen:admin']
  //       }
  //     }
  //   ]
  // },

  {
    path: '/system',
    component: Layout,
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
    // {
    //   path: 'auth',
    //   component: () => import('@/views/auth/index'), // Parent router-view
    //   name: 'auth-manger',
    //   meta: {
    //     title: '人员权限',
    //     // roles: ['admin:auth']
    //   }
    // }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const router = new VueRouter({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
/* 以下方法存在一个问题，当登录一个权限较少的用户时，再注销然后登录一个权限较多的用户时，
权限较多的用户会无法访问权限许可访问的页面，而先登录权限较多的用户，再注销然后登录权限较少的用户时，
权限较少的用户访问一切正常，并且也无法通过更改URL的方式访问不属于自己的页面，原因待探究，
先用刷新页面重置整个路由的方式进行解决 */
// router.$resetRouter = () => { // new一个路由对象，并通过重新匹配路由的方式清除原有路由和注入新的路由防止BUG
//   router.matcher = new VueRouter({
//     scrollBehavior: () => ({
//       y: 0
//     }),
//     routes: constantRouterMap
//   }).matcher
// }

// router.$goLogin = () => { // 跳转至登录页
//   router.push({ path: '/login' })
// }

// router.$addRoutes = (routes = []) => { // 动态添加路由
//   const newRouter = new VueRouter({
//     scrollBehavior: () => ({
//       y: 0
//     }),
//     routes: constantRouterMap
//   }).matcher
//   newRouter.addRoutes(routes)
//   router.matcher = newRouter
//   console.log(routes)
//   // router.push({ path: '/home' })
// }

export default router
