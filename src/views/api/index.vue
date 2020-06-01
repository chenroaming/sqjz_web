<template>
  <div class="apiBody">
    <el-row>
      <!-- 菜单栏 -->
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-menu
            default-active="3966"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            @open="handleOpen"
            @close="handleClose">
            <el-menu-item index="3966" @click="getDetail('api.000','Preface','前言','')">
              <i class="el-icon-document"/>
              <span slot="title">前言</span>
            </el-menu-item>
            <el-submenu v-for="(item, num) in oneAuthList" v-if="item.apiId != 'api.000'" :index="num" :key="num">
              <template slot="title">
                <i class="el-icon-location"/>
                <span>{{ item.apiContent }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(val, n) in item.children" :key="num" :index="num | getIndex(n)" @click="getDetail(val.apiId,val.apiName,item.apiContent,val.apiContent)">{{ val.apiContent }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
      </el-col>
      <!-- api内容显示区域 -->
      <el-col :span="20">
        <el-row style="padding-left: 30px;background-color:#F8F8FF;">
          <el-col :span="20">
            <el-breadcrumb separator="/" style="height: 60px;line-height: 60px;">
              <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>第三方API</el-breadcrumb-item>
              <el-breadcrumb-item>{{ fName }}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="myName != ''">{{ myName }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="4" class="btnItem">
            <el-button type="primary" round size="mini" @click="gotoLogin">后台系统登录</el-button>
          </el-col>
        </el-row>

        <div class="grid-content bg-purple-light api-content" v-html="detailContent"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getApiList, getApiDetail } from '@/api/apiList'
export default {
  filters: {
    getIndex(num, n) {
      return num + '-' + n
    }
  },
  data() {
    return {
      msg: 'aa',
      allAuthList: [], // 所有菜单选项
      oneAuthList: [], // 一级菜单
      detailContent: '',
      fName: '前言', // 一级菜单名称
      myName: ''// 接口名称
    }
  },
  mounted() {
    // 获取API接口菜单
    getApiList()
      .then(res => {
        this.allAuthList = res.data.List
        this.dealAllAuthList()
        this.dealSonAuthList()
      // console.log(this.oneAuthList)
      }).catch(() => {})
    // 直接获取前言
    this.getDetail('api.000', 'Preface', '前言', '')
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },

    // 处理一级权限(筛选出一级菜单)
    dealAllAuthList() {
      this.oneAuthList = this.allAuthList.filter((val, index) => {
        this.$set(val, 'children', [])
        return val.type === 1
      })
    },

    // 处理二级权限(筛选出每个一级菜单下面的二级菜单)
    dealSonAuthList() {
      const parLen = this.oneAuthList.length
      const sonLen = this.allAuthList.length
      for (let i = 0; i < parLen; i++) {
        for (let j = 0; j < sonLen; j++) {
          if (this.oneAuthList[i].id === this.allAuthList[j].parentId) {
            this.oneAuthList[i].children.push(this.allAuthList[j])
          }
        }
      }
    },
    // 获取详情
    getDetail(id, name, fName, myName) {
      this.fName = fName
      this.myName = myName
      const loading = this.$loading({
        lock: true,
        text: '正在为您获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 1)'
      })
      this.detailContent = ''
      setTimeout(() => {
        loading.close()
        const obj = { apiId: id, apiName: name }
        getApiDetail(obj)
          .then(res => {
            this.detailContent = res.data.apiContent
          }).catch(() => {})
      }, 700)
    },
    // 跳转到登录页
    gotoLogin() {
      const loading = this.$loading({
        lock: true,
        text: '正在为您跳转中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
        this.$router.push({ path: '/login' })
      }, 2000)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .apiBody{
    height: 100%;
    min-height: 936px;
    overflow-x: hidden;
  }
  .apiBody::-webkit-scrollbar {
  width: 0px;
  }
  .grid-content{
    height: 100%;
  }
  .api-content{
    // min-height: 1000px;
    // background-color: red
  }
  .el-menu-vertical-demo{
    height: 100%;
    min-height: 936px;
    background-color:#545c64;
    overflow-y: auto
  }

  // 内容显示区域
  .api-content{
    padding-left: 30px;
    height: 880px;
    overflow-y: auto
  }
  /deep/.api-content table{
    border: 2px solid black;
    border-collapse:collapse;
    text-align: center
  }
  /deep/.api-content th{
    width: 300px;
    text-align: center;
    border: 1px solid black;
    border-collapse: collapse;
  }
  /deep/.api-content td{
    border: 1px solid black;
  }
  /deep/.api-content tr{
    border: 1px solid black;
  }
  .btnItem{
    text-align: left
  }
  .btnItem>button{
    height: 35px;
    // width: 80px;
    border-radius: 17px;
    color: white;
    background-color: rgb(7, 42, 123);
    border: none;
    margin-top: 12.5px
  }
</style>
