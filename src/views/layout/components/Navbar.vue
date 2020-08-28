<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb />
    <el-dropdown class="avatar-container" trigger="click">
      <span style="cursor: pointer;">
        <el-image :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"/>
        <i class="el-icon-caret-bottom"/>
      </span>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>主页</el-dropdown-item>
        </router-link>
        <router-link class="inlineBlock" to="/changepwd">
          <el-dropdown-item divided>修改密码</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">注销</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="avatar-container">
      <areaCascader/>
      <router-link :to="{ path:'/index' }" style="margin-right:15px;" target="_blank">
        <el-button type="primary" size="mini">进入官网</el-button>
      </router-link>
      <span class="avatar-username">
        所属区域：
        <span style="color:#409eff;margin-right:10px">{{ areaName }}</span>
      </span>
      <span class="avatar-username">
        欢迎您：
        <span style="color:#409eff">{{ name }}</span>
      </span>
    </div>
    <!-- <el-dropdown class="area-container">
      <div class="avatar-wrapper"></div>
    </el-dropdown>-->
  </el-menu>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/breadCrumb'
import Hamburger from '@/components/Hamburger'
import { getChangeAreaList } from '@/api/area'
import areaCascader from './cascader/areaCascader'
// import Vue from 'vue'
// const areaCascader = Vue.component('async-webpack-example', (resolve) => {
//   // 这个特殊的 `require` 语法将会告诉 webpack
//   // 自动将你的构建代码切割成多个包，这些包
//   // 会通过 Ajax 请求加载
//   setTimeout(() => {
//     require(['./cascader/areaCascader'], resolve)
//   }, 5000)
// })
// const areaCascader = () => ({
//   // 需要加载的组件 (应该是一个 `Promise` 对象)
//   component: import('./cascader/areaCascader'),
//   // 异步组件加载时使用的组件
//   // loading: LoadingComponent,
//   // 加载失败时使用的组件
//   // error: ErrorComponent,
//   // 展示加载时组件的延时时间。默认值是 200 (毫秒)
//   delay: 2000,
//   // 如果提供了超时时间且组件加载也超时了，
//   // 则使用加载失败时使用的组件。默认值是：`Infinity`
//   timeout: 3000
// })
export default {
  components: {
    Breadcrumb,
    Hamburger,
    areaCascader
  },
  data() {
    return {
      areaList: [] // 所有的区域列表
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar']),
    ...mapState({
      name: state => state.user.name,
      areaName: state => state.user.areaName
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        // location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    // 点击区域名字，获取区域列表
    changeArea() {
      getChangeAreaList()
        .then(res => {
          this.areaList = res.data.List
        })
        .catch(() => {
          this.areaList = []
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .area-container {
    // height: 50px;
    display: inline-block;
    // position: absolute;
    float: right;
    margin-right: 10px;
    // right: 215px;
    cursor: pointer;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    margin-right: 20px;
    /* cursor: pointer; */
    // position: absolute;
    // right: 35px;
    float: right;
    .avatar-username {
      margin-right: 20px;
      font-size: 14px;
      color: #606266;
    }
    // .avatar-wrapper {
    //   cursor: pointer;
    //   margin-top: 5px;
    //   position: relative;
    //   line-height: initial;
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      vertical-align: middle;
      cursor: pointer;
    }
    //   .el-icon-caret-bottom {
    //     position: absolute;
    //     right: -20px;
    //     top: 15px;
    //     font-size: 12px;
    //   }
    // }
  }
}
.user-dropdown {
  top: 37px !important;
  transform: translateX(10px) !important;
  // margin-right:10px!important;
}
.area-dropdown {
  cursor: pointer;
  top: 37px !important;
  transform: translateX(10px) !important;
  // margin-right:10px!important;
}
</style>

