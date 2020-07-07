<template>
  <el-container class="mainbg">
    <el-header style="height: auto;">
      <el-row>
        <el-col :span="8" :offset="5">
          <!-- 头部导航栏 -->
          <p class="sj_title">福建智慧矫正可视化监管平台</p>
        </el-col>
        <el-col :span="10" style="margin-top: 15px;">
          <!-- <el-button type="primary" round size="mini" @click="gotoLogin">登&nbsp;&nbsp;录</el-button> -->

          <el-popover placement="bottom" width="500" trigger="click">
            <el-row>
              <el-col :span="24" style="text-align: center;color:red;">
                <p>扫描下方二维码即可下载</p>
              </el-col>
            </el-row>
            <el-row v-for="(item, index) in appQrArr" :key="index">
              <el-col
                v-for="(item2, index2) in item"
                :key="index2"
                :span="12"
                style="padding:20px"
              >
                <div style="width:100%;">
                  <el-image
                    :src="item2.qrCodePath"
                    :fit="contain"
                    :preview-src-list="item2.qrCodePath2"
                    style="width: 150px; height: 150px;margin:0 auto;display: block;"
                  />
                </div>
                <div style="text-align: center;color:#666;">
                  <h5>版本：{{ item2.version }}</h5>
                  <h3>{{ item2.appName }}</h3>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="copyText(item2)"
                  >复制下载链接</el-button
                  >
                </div>
              </el-col>
            </el-row>

            <p slot="reference" class="upload" style="width: 125px;">
              <i
                class="el-icon-upload"
                style="margin-right: 15px;color:#666"
              />APP下载
            </p>
          </el-popover>

          <p class="upload" @click="gotoLogin">
            <i class="el-icon-success" style="margin-right: 15px;color:#666"/>登&nbsp;录
          </p>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-container>
        <!-- 轮播图区域 -->
        <div class="block">
          <el-carousel height="600px">
            <el-carousel-item
              v-for="(item, index) in bannerlist"
              :key="index"
              :style="{ backgroundImage: 'url(' + item.url + ')' }"
              class="banner"
            />
          </el-carousel>
        </div>

        <el-footer>
          <el-row style="padding:30px 30px 0 0;text-align: center;">
            <el-col :span="24" style="">
              <!-- <p class="sj_f1">
                Copyright © 2020 智慧司法-矫正一体化平台 版权所有
              </p> -->
              <p class="sj_f1">Copyright © 2020 厦门纵横集团 版权所有</p>
            </el-col>
            <!-- <el-col :span="6">

            </el-col> -->
          </el-row>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// import item1 from '~/item1.png'
// console.log(item1)
import { find } from '@/api/versionFile.js'
export default {
  data() {
    return {
      bannerlist: [
        { url: '../../../static/index_images/ban1.png' },
        { url: '../../../static/index_images/ban2.png' },
        { url: '../../../static/index_images/ban3.png' }
      ],
      versionType: ['（安卓版）', '（IOS版）'],
      appType: ['福建在矫通', '福建矫务通'],
      appQrArr: [],
      zjtPic: {},
      jwtPic: {},
      zjtPicIos: {},
      jwtPicIos: {},
      contain: 'contain'
    }
  },
  mounted() {
    find().then(res => {
      if (res.data.state == 100) {
        const newArr = res.data.list.map(item => {
          return {
            ...item,
            qrCodePath2: [`${location.origin}${item.qrCodePath}`],
            appName: `${this.appType[item.appType - 1]}${
              this.versionType[item.versionType - 1]
            }`
          }
        })
        const [androidZjt, androidJwt, IOSZjt, IOSJwt] = newArr
        this.appQrArr = [
          [{ ...androidZjt }, { ...androidJwt }],
          [{ ...IOSZjt }, { ...IOSJwt }]
        ]
      }
    })
  },
  methods: {
    copyText({ versionType, filePath }) {
      if (filePath == '') {
        this.$message({
          message: '链接复制错误',
          type: 'error'
        })
      } else {
        var oInputValue =
          versionType === 1 ? `${location.origin}${filePath}` : `${filePath}`
        const oInput = document.createElement('input')
        oInput.value = oInputValue
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;
        document.execCommand('Copy') // 执行浏览器复制命令
        this.$message({
          message: '已成功复制到剪切板',
          type: 'success'
        })
        console.log(oInputValue)
        oInput.remove()
      }
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
// 总体布局
.el-header,
.el-footer,
.el-main {
  padding: 0;
  margin: 0;
}
.upload {
  cursor: pointer;
  margin-left: 60px;
  display: inline-block;
  width: 85px;
  font-weight: normal;
  height: 29px;
  font-size: 18px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 29px;
}
.mainbg {
  background: rgba(255, 255, 255, 1);
}
.sj_title {
  width: 400px;
  height: 29px;
  font-size: 28px;
  font-family: HuXiaoBo-NanShen, HuXiaoBo;
  font-weight: normal;
  color: rgba(33, 33, 33, 1);
  line-height: 29px;
}
.sj_f2 {
  width: 100%;
  height: 20px;
  font-size: 12px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  line-height: 20px;
}
.sj_f1 {
  width: 100%;
  height: 20px;
  font-size: 12px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  line-height: 20px;
}
.indexContent {
  min-width: 1000px;
}
.logoItem {
  width: 220px;
  background-image: url("../../assets/index_images/indexLogo.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
.visiItem {
  width: 15%;
  visibility: 0;
}
.logoItem:hover,
.visiItem:hover,
.btnItem:hover {
  background-color: white !important;
}
.btnItem {
  text-align: right;
}
.btnItem > button {
  height: 35px;
  width: 80px;
  border-radius: 17px;
  color: white;
  background-color: rgb(7, 42, 123);
  border: none;
  margin-top: 12.5px;
}
// 轮播图
.banner {
  width: 100%;
  height: 600px;
  // background-image: url("../../../static/index_images/ban1.png");
  background-repeat: no-repeat;
  background-size: cover;
}
// 项目展示
.box {
  width: 100%;
  height: 350px;
  margin: 50px auto;
  margin-bottom: 0;
}
.box h3 {
  width: 100%;
  text-align: center;
  line-height: 50px;
  color: rgb(7, 42, 123);
  // box-shadow: 0 2px 5px -1px rgb(7, 42, 123)
}
.box h6 {
  width: 35px;
  margin: 0 auto;
  margin-top: -25px;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-block-width: 20px;
  border-bottom-color: rgb(7, 42, 123);
}
.box ul {
  display: flex;
  justify-content: space-between;
  padding: 0;
}
.box ul li {
  // float: left;
  width: 230px;
  height: 250px;
  // margin: 0 20px 20px 0;
  list-style: none;
  position: relative;
  overflow: hidden;
}
.box ul li .cover a {
  width: 30px;
  height: 30px;
  background: #ffffff;
  display: block;
  border-radius: 50%;
  line-height: 30px;
  margin: 30px auto;
}
.box ul li .cover a i {
  color: red;
}
/* ÕÚÕÖ²ã */
.box ul li .cover {
  width: 230px;
  height: 250px;
  background: rgba(97, 97, 97, 0.3);
  position: absolute;
  left: 0;
  top: 0;
  text-align: center;
  color: #ffffff;

  transform-origin: right bottom; /*Ðý×ªÖÐÐÄÎ»ÖÃ*/
  -webkit-transform-origin: right bottom;
  -moz-transform-origin: right bottom;

  transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);

  transition: all 0.35s;
  -webkit-transition: all 0.35s;
  -moz-transition: all 0.35s;
}
.box ul li .cover p {
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
}
.box ul li:hover .cover {
  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
}
//案例赏析
// .anli{
//   he
// }
.anliItem {
  width: 100%;
  height: 350px;
}
.anliItem img {
  width: 100%;
  height: 100%;
}
.anliItem h5 {
  color: rgb(21, 44, 76);
  margin: 0;
  line-height: 20px;
  font-size: 16px;
}
.anliItem p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  width: 100%;
  height: 40px;
  line-height: 20px;
  text-indent: 2em;
  font-size: 13px;
  color: rgb(169, 169, 169);
}
.line {
  height: 1px;
  background-color: #e0e6ed;
  margin: 10px 0;
}
.anliItem h4 {
  color: rgb(21, 44, 76);
  margin: 0;
  line-height: 30px;
  font-size: 14px;
}
.anliImg {
  display: flex;
  justify-content: space-between;
  margin-top: 11px;
}
.anliImg img {
  width: 30%;
  height: 100%;
  margin-bottom: 0px;
}
// 第三方API
.apiBox {
  height: 750px;
  width: 100%;
  margin-top: 50px;
}
.apiBox img {
  width: 100%;
  height: 100%;
}
</style>
