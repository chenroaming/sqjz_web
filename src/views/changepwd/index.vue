<template>
  <div>
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <el-form-item prop="oldPassword">
          <span class="svg-container">
            <svg-icon icon-class="password" style="color:black"/>
          </span>
          <el-input
            v-model="loginForm.oldPassword"
            type="password"
            name="oldPassword"
            auto-complete="on"
            placeholder="请输入原始密码"
            show-password
            style="color:black"
            @keyup.enter.native="changepwd"/>
        </el-form-item >
        <el-form-item prop="newPassword">
          <span class="svg-container">
            <svg-icon icon-class="password" style="color:black" />
          </span>
          <el-input
            v-model="loginForm.newPassword"
            type="password"
            name="newPassword"
            auto-complete="on"
            placeholder="请设置您的新密码"
            show-password
            style="color:black"
            @keyup.enter.native="changepwd"/>
        </el-form-item >
        <el-form-item prop="againPassword">
          <span class="svg-container" style="color:black">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            v-model="loginForm.againPassword"
            type="password"
            name="againPassword"
            auto-complete="on"
            placeholder="请再次输入新密码"
            show-password
            style="color:black"
            @keyup.enter.native="changepwd"/>
        </el-form-item >

        <el-form-item class="loginBtn">
          <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="changepwd">
            确认修改
          </el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import mixin from '@/utils/mixins'
// eslint-disable-next-line no-unused-vars
import { mapGetters, mapState } from 'vuex'
import { changePassword } from '@/api/login'

export default {
  name: 'Changepwd',
  mixins: [mixin],
  data() {
    return {
      loginForm: {
        oldPassword: '',
        newPassword: '',
        againPassword: ''
      },
      loginRules: {
        oldPassword: [{ required: true, trigger: ['blur', 'change'], message: '请输入原密码' }],
        newPassword: [{ required: true, trigger: ['blur', 'change'], validator: this.validPassword }],
        againPassword: [{ required: true, trigger: ['blur', 'change'], validator: this.validPassword }]
      },
      loading: false,
      redirect: undefined
    }
  },
  methods: {
    // 修改密码
    changepwd() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          return false
        }
        this.loading = true
        changePassword(this.loginForm.oldPassword, this.loginForm.newPassword)
          .then(({ data: { state, message }}) => {
            this.loading = false
            state === '100' &&
              this.$store.dispatch('LogOut').then(() => {
                this.$router.push({ path: '/login' })
              })
          }).catch(() => {})
      })
    },
    validPassword(rule, value, callback) {
      if (value.length < 5) {
        callback(new Error('新密码不能小于5位'))
      } else if (this.loginForm.newPassword !== this.loginForm.againPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        this.$refs['loginForm'].clearValidate('newPassword')
        callback()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#606266;
.fullscreenvideo {
    position: absolute;
    object-fit: fill;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 110%;
    width: 100%;
    height: 100%;
    z-index: -100;
}

.videocontainer{
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -100;
}

/* reset element-ui css */
.login-container {
  width: 100%;
  height: 100%;
  background-color: white;
  .el-input {
    display: inline-block;
    height: 35px;
    width: 80%;
    vertical-align: middle;
    margin-left: 1%;
    input {
      background: transparent;
      border: 0px;
      color: black;
      -webkit-appearance: none;
      // border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: white;
      height: 35px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid #DCDFE6;
    // border-radius: 5px;
    color: #454545;
    // margin-bottom: 35px;
  }
  .el-form-item__error {
    margin-top:2px;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  .login-form {
    position: fixed;
    left: 50%;
    // right: 0;
    top: 30%;
    margin-left: -100px;
    width: 430px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
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
    color: white;
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
  .loginCode {
    line-height: 50px;
    img {
      position: absolute;
      bottom: 1px;
      right: 0px;
      height: 50px;
      cursor: pointer;
      width: 100px;
      // border-radius: 5px;
    }
  }
</style>
