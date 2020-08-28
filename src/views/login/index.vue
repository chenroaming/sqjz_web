<template>
  <div class="login-container">
    <div>
      <img
        src="../../assets/login_images/webLogo.png"
        alt
        style="position: absolute;top: 10px;width: 45px;left:50px;"
        class="webLogo"
      >
      <span
        style="position: absolute;top: 20px;left: 122px;font-size: 20px;color: white;letter-spacing: 5px;"
      >智慧矫正可视化监管平台</span
      >
      <!-- 智慧司法-矫正一体化平台 -->
    </div>
    <div class="uiiui">
      <img
        src="../../assets/login_images/bigLogin.jpg"
        alt
        style="position: absolute; width: 60%;left: 0;top: 0;   height: 100%;"
      >
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <p
          style="text-align: center;color: #00a1ea;font-weight: 800;letter-spacing: 10px;font-size: 20px;margin-top: 20px;"
        >
          欢迎登陆
        </p>
        <div id="blueline" />
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            v-model="loginForm.username"
            name="username"
            type="text"
            auto-complete="on"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <div class="loginCodeBox">
          <div class="sliding-pictures" style="height:150px">
            <div
              class="vimg"
              style="width: 270px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 3px 3px 0 0;"
            >
              <img
                id="oImageUrl"
                :src="oImageUrl"
                style="position: absolute;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);filter: blur(0.5px);"
              >
              <img
                id="tImageUrl"
                ref="btnImg"
                :src="tImageUrl"
                :style="yLength"
                style="position: relative;left:5px;filter: blur(0.3px);"
              >
            </div>
            <div id="box" onselectstart="return false;">
              <div id="bgColor"/>
              <div id="txt" style="color: #666;">拖动左边滑块完成上方拼图</div>
              <div
                id="slider"
                ref="remove"
                style="cursor: pointer;border-radius:0px 5px 5px 0px"
                @mousedown="bind"
                @touchstart="touchStart"
                @touchmove="touchMove"
                @touchend="touchEnd"
              >
                <i
                  style="font-size: 20px;cursor: pointer;"
                  class="el-icon-d-arrow-right"
                  onselectstart="return false;"
                />
              </div>
            </div>
            <i
              style="margin-left:8px"
              title="刷新验证码"
              class="el-icon-refresh"
              @click="init()"
            />
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import mixin from '@/utils/mixins'
import {
  validateUsername,
  validatePass,
  validateCode1
} from '@/utils/validate'
import { validateCode, verifyValidateCode } from '@/api/login'
export default {
  name: 'Login',
  mixins: [mixin],
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        // pinCode: "",
        type: 'web'
      },
      leftValue: 0,
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass
          }
        ],
        pinCode: [
          {
            required: true,
            trigger: 'blur',
            validator: validateCode1
          }
        ]
      },
      checked: true,
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      codeData: [],
      detailMsg: '',
      imageUrl: '',
      tImageUrl: '',
      oImageUrl: '',
      yLength: {
        top: ''
      },
      gridButton: '',
      tips: '拖动左边滑块完成上方拼图',
      isVerificationShow: false,
      codeVisible: false,
      visible2: false,
      boxTrue: false,
      box: false,
      visible1: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
    this.getCookie()
  },
  methods: {
    init() {
      validateCode()
        .then(res => {
          this.imageUrl = res.data.result.image
          this.oImageUrl = res.data.result.oImage
          this.tImageUrl = res.data.result.tImage
          this.yLength.top = res.data.result.yLength * 152 + 'px'
          var odiv = document.querySelector('#slider')
          var tImageUrl = document.querySelector('#tImageUrl')
          var oImageUrl = document.querySelector('#oImageUrl')
          var bgColor = document.querySelector('#bgColor')
          var txt = document.querySelector('#txt')
          var box = document.querySelector('#box')
          odiv.style.left = 0
          tImageUrl.style.left = '0' + 'px'
          bgColor.style.width = 0
        })
        .catch(() => {})
    },

    touchStart: function(ev) {
      ev = ev || event
      ev.preventDefault()
      var odiv = document.querySelector('#slider')
      var tImageUrl = document.querySelector('#tImageUrl')
      var oImageUrl = document.querySelector('#oImageUrl')
      var bgColor = document.querySelector('#bgColor')
      var txt = document.querySelector('#txt')
      var box = document.querySelector('#box')
      if (ev.touches.length == 1) {
        // tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
        this.startX = ev.touches[0].clientX // 记录开始位置
      }
    },
    touchMove: function(ev) {
      ev = ev || event
      ev.preventDefault()
      var odiv = document.querySelector('#slider')
      var tImageUrl = document.querySelector('#tImageUrl')
      var oImageUrl = document.querySelector('#oImageUrl')
      var bgColor = document.querySelector('#bgColor')
      var txt = document.querySelector('#txt')
      var box = document.querySelector('#box')
      const btnWidth = this.$refs.remove.offsetWidth // $refs 减少获取dom节点的消耗
      const btnImg = this.$refs.btnImg.offsetWidth
      if (ev.touches.length == 1) {
        // 滑动时距离浏览器左侧的距离
        this.moveX = ev.touches[0].clientX
        // 实时的滑动的距离-起始位置=实时移动的位置
        this.disX = this.moveX - this.startX
        if (this.disX < 0 || this.disX == 0) {
          odiv.style.left = 0
          tImageUrl.style.left = 0 + 'px'
          bgColor.style.width = 0
        } else if (this.disX > 0) {
          odiv.style.left = this.disX + 'px'
          tImageUrl.style.left = this.disX + 'px'
          bgColor.style.width = this.disX + 'px'
          // 最大也只能等于删除按钮宽度
          if (this.disX >= 250) {
            odiv.style.left = 0
            tImageUrl.style.left = 0 + 'px'
            bgColor.style.width = 0
          }
        }
      }
    },
    touchEnd: function(ev) {
      var odiv = document.querySelector('#slider')
      var tImageUrl = document.querySelector('#tImageUrl')
      var oImageUrl = document.querySelector('#oImageUrl')
      var bgColor = document.querySelector('#bgColor')
      var txt = document.querySelector('#txt')
      var box = document.querySelector('#box')
      ev = ev || event
      ev.preventDefault()
      const btnWidth = this.$refs.remove.offsetWidth
      const btnImg = this.$refs.btnImg.offsetWidth
      if (ev.changedTouches.length == 1) {
        const endX = ev.changedTouches[0].clientX
        this.disX = endX - this.startX
      }
      const pinCode = this.disX / 270
      // console.log(pinCode);
      odiv.style.left = 0
      // tImageUrl.style.left = 0 + 'px';
      bgColor.style.width = 0
      verifyValidateCode(pinCode)
        .then(res => {
          if (res.state == '100') {
            setTimeout(() => {
              this.$refs.loginForm.validate(valid => {
                if (valid) {
                  this.loading = true
                  this.loginForm.pinCode = pinCode
                  this.$store
                    .dispatch('Login2', this.loginForm)
                    .then(() => {
                      this.loading = false
                      this.$router.push({
                        path: '/home/index'
                      })
                    })
                    .catch(() => {
                      this.loading = false
                      this.init()
                    })
                } else {
                  return false
                }
              })
            }, 1000)
          } else {
            this.init()
          }
        })
        .catch(err => {
          console.log(err)

          this.init()
        })
    },
    bind(e) {
      const odiv = document.querySelector('#slider')
      const tImageUrl = document.querySelector('#tImageUrl')
      const oImageUrl = document.querySelector('#oImageUrl')
      const bgColor = document.querySelector('#bgColor')
      const txt = document.querySelector('#txt')
      const box = document.querySelector('#box')
      // 算出鼠标相对元素的位置
      const disX = e.clientX - odiv.offsetLeft
      const disY = e.clientY - odiv.offsetHeight
      document.onmousemove = e => {
        // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        const left = e.clientX - disX
        const top = e.clientY - disY

        if (left >= 2 && left <= 223) {
          // 绑定元素位置到positionX上面 this.positionY=left; //移动当前元素
          odiv.style.left = left + 'px'
          tImageUrl.style.left = left + 'px'
          bgColor.style.width = left + 'px'
        } else {
        }
      }
      document.onmouseup = e => {
        document.onmousemove = null // 清除事件
        const left = e.clientX - disX
        document.onmouseup = null // 清除事件
        // 判断验证码
        const pinCode = left / 270
        tImageUrl.style.left = '-8' + 'px'
        odiv.style.left = 0 // 鼠标回到起始位置
        bgColor.style.width = 0 // 背景宽度
        verifyValidateCode(pinCode)
          .then(res => {
            if (res.data.state == '100') {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              setTimeout(() => {
                this.$refs.loginForm.validate(valid => {
                  if (valid) {
                    this.loading = true
                    this.loginForm.pinCode = pinCode
                    this.$store
                      .dispatch('Login2', this.loginForm)
                      .then(({ data: { state }}) => {
                        state === '100' &&
                          this.$router.push({ path: '/home/index' })
                      })
                      .catch(() => {
                        this.loading = false
                        this.init()
                      })
                  } else {
                    this.init()
                    return false
                  }
                })
              }, 1000)
            } else {
              this.init()
              this.$message({
                type: 'error',
                message: '验证失败'
              })
              return false
            }
          })
          .catch(() => {})
      }
      document.onmouseleave = e => {
        tImageUrl.style.left = 0 + 'px'
        odiv.style.left = 0 // 鼠标回到起始位置
        bgColor.style.width = 0 // 背景宽度
        document.onmousemove = null // 清除事件
      }
      return false
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #606266;
/* reset element-ui css */
.uiiui {
  position: relative;
  border: 1px solid;
  width: 900px;
  height: 500px;
  background: rgb(255, 255, 255);
  /* left: 50%; */
  top: 200px;
  /* top: 50%; */
  left: 50%;
  margin-left: -450px;
}
.login-container {
  width: 100%;
  height: 100%;
  .el-input {
    display: inline-block;
    height: 35px;
    width: 70%;
    vertical-align: middle;
    margin-left: 1%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      /* // border-radius: 0px; */
      padding: 12px 5px 12px 15px;
      /* color: white; */
      height: 35px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #666 !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid #dcdfe6;
    // border-radius: 5px;
    /* color: white; */
    // margin-bottom: 35px;
  }
  .el-form-item__error {
    margin-top: 2px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-image: url("../../assets/login_images/webBg.jpg");
  background-repeat: no-repeat;
  // background-size: cover;
  background-size: 100% 100%;
  .login-form {
    position: absolute;
    // position: fixed;
    // left: 56%;
    right: 0;
    // right: 0;
    top: 0;
    width: 40%;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    /* background-image: url("../../assets/login_images/login-bg.png"); */
    background-size: 100% 100%;
    // margin: 120px auto;
    // background: #fff;
    /* border-radius: 5px; */
    background-color: white;
    // height: 52%;
    height: 100%;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 15px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: dodgerblue;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: #303133;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

.loginBtn {
  border: none;
}

#blueline {
  width: 30px;
  height: 4px;
  background-color: #00a1ea;
  border-radius: 10px;
  margin: 20px auto;
}

//---------------
.vimg {
  width: 300px;
  height: 150px;
  margin: 0 auto;
}

#box {
  position: relative;
  width: 270px;
  top: -8px;
  height: 40px;
  margin: 0 auto;
  margin-top: 10px;
  background-color: #e8e8e8;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}

#bgColor {
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 40px;
  background-color: #7ac23c;
}

#txt {
  position: absolute;
  width: 70%;
  height: 39px;
  line-height: 40px;
  font-size: 14px;
  color: #88949d;
  text-align: center;
  left: 50px;
}

#slider {
  width: 100%;
  height: 65px;
  border-bottom: #c7c9d0 1px solid;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

#sliderTrue {
  width: 100%;
  height: 65px;
  border-bottom: #c7c9d0 1px solid;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

#slider {
  position: absolute;
  left: 0;
  top: 0;
  width: 50px;
  height: 40px;
  border: 1px solid #ccc;
  background: #fff;
  text-align: center;
  cursor: move;
}

#slider > i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#slider.active > i {
  color: green;
}
</style>
