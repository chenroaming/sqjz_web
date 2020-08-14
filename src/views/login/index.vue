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
      >智慧矫正可视化监管平台</span>
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
        @submit.prevent="logintext2"
        @keyup.enter.native="logintext2"
      >
        <p
          style="text-align: center;color: #00a1ea;font-weight: 800;letter-spacing: 10px;font-size: 20px;margin-top: 20px;"
        >欢迎登陆</p>
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
            show-password/>
        </el-form-item>

        <el-form-item prop="pinCode">
          <span class="svg-container">
            <svg-icon icon-class="snapshot" />
          </span>
          <el-input
            v-model="loginForm.pinCode"
            type="text"
            placeholder="请输入验证码"/>
          <el-image
            :src="codeSrc"
            style="position: absolute;top: 5px;right: 15px;cursor: pointer;"
            @click="getCode"/>
        </el-form-item>

        <el-form-item class="loginBtn">
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;"
            @click="logintext2"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import mixin from '@/utils/mixins'
import { validateUsername, validatePass, validateCode } from '@/utils/validate'
export default {
  name: 'Login',
  mixins: [mixin],
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        pinCode: '',
        type: 'web'
      },
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
            validator: validateCode
          }
        ]
      },
      loading: false,
      codeSrc: '/community_correction/webAdmin/admin/validateCode.jhtml'
    }
  },
  methods: {
    // 登录事件
    logintext2() {
      this.$refs['loginForm'].validate((valid) => {
        if (!valid) return
        this.loading = true
        this.$store
          .dispatch('Login2', this.loginForm)
          .then(({ data: { state }}) => {
            state === '100' && this.$router.push({ path: '/home/index' })
            state !== '100' && this.getCode()
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    getCode() {
      this.codeSrc = `${this.codeSrc}?${Math.random()}` // 刷新验证码
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
</style>
