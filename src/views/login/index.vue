<template>
  <div>
    <div class="login-container">
      <div>
        <img
          src="../../assets/login_images/webLogo.png"
          alt
          style="position: absolute;top: 10px;width: 45px;left:50px;"
          class="webLogo"
        />
        <span
          style="position: absolute;top: 20px;left: 122px;font-size: 20px;color: white;letter-spacing: 5px;"
        >智慧司法-矫正一体化平台</span>
        <!-- 智慧司法-矫正一体化平台 -->
      </div>
      <div class="uiiui">
        <img
          src="../../assets/login_images/bigLogin.jpg"
          alt
          style="position: absolute; width: 60%;left: 0;top: 0;   height: 100%;"
        />
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
              v-show="pwdType === 'password'"
              v-model="loginForm.password"
              type="password"
              name="password"
              auto-complete="on"
              placeholder="请输入密码"
              @keyup.enter.native="logintext2"
            />
            <el-input
              v-show="pwdType === ''"
              v-model="loginForm.password"
              type="text"
              placeholder="请输入密码"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-form-item class="loginBtn">
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;margin-top:20px"
              @click="logintext2"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { isvalidUsername } from "@/utils/validate";
import {
  blockValidateCode,
  verifyBlockValidateCode,
  login2
} from "@/api/login";
import mixin from "@/utils/mixins";
import PuzzleVerification from "vue-puzzle-verification";

export default {
  name: "Login",
  components: {
    PuzzleVerification
  },
  mixins: [mixin],
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    // eslint-disable-next-line no-unused-vars
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请滑动校验验证码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        visible: "",
        password: "",
        pinCode: ""
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePass
          }
        ]
        // loginCode: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined,
      codeData: [],
      detailMsg: "",
      imageUrl: "",
      tImageUrl: "",
      oImageUrl: "",
      yLength: {
        top: ""
      },
      gridButton: "",
      tips: "拖动左边滑块完成上方拼图",
      isVerificationShow: false,
      codeVisible: false,
      visible2: false,
      boxTrue: false,
      box: false,
      visible1: false
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 刷新验证码
    refreshClick() {
      blockValidateCode()
        .then(res => {
          this.codeData = res.data.result;
          this.imageUrl = res.data.result.image;
          this.oImageUrl = res.data.result.oImage;
          this.tImageUrl = res.data.result.tImage;
          this.yLength.top = res.data.result.yLength * 180 + 12 + "px";
        })
        .catch(() => {
          this.codeData = [];
          this.refreshClick();
        });
      const odiv = document.querySelector("#slider");
      const tImageUrl = document.querySelector("#tImageUrl");
      const oImageUrl = document.querySelector("#oImageUrl");
      const bgColor = document.querySelector("#bgColor");
      odiv.style.left = 0;
      tImageUrl.style.left = 12 + "px";
      bgColor.style.width = 0;
    },
    // bind(e) {
    //   // let odiv = e.currentTarget;
    //   const odiv = document.querySelector("#slider");
    //   const tImageUrl = document.querySelector("#tImageUrl");
    //   const oImageUrl = document.querySelector("#oImageUrl");
    //   const bgColor = document.querySelector("#bgColor");
    //   const txt = document.querySelector("#txt");
    //   const box = document.querySelector("#box");
    //   // 算出鼠标相对元素的位置
    //   const disX = e.clientX - odiv.offsetLeft;
    //   const disY = e.clientY - odiv.offsetHeight;

    //   odiv.onmousemove = e => {
    //     // 鼠标按下并移动的事件
    //     // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    //     const left = e.clientX - disX;
    //     const top = e.clientY - disY;
    //     if (left >= 2 && left <= 270) {
    //       // 绑定元素位置到positionX上面
    //       this.positionY = left;
    //       // 移动当前元素
    //       odiv.style.left = left + "px";
    //       tImageUrl.style.left = left + 12 + "px";
    //       bgColor.style.width = left + "px";
    //     } else {
    //     }
    //   };
    //   odiv.onmouseup = e => {
    //     odiv.onmousemove = null; // 清除事件
    //     const left = e.clientX - disX;
    //     odiv.onmouseup = null; // 清除事件
    //     // 判断验证码
    //     const pinCode = left / 320;
    //     tImageUrl.style.left = 12 + "px";
    //     odiv.style.left = 0; // 鼠标回到起始位置
    //     bgColor.style.width = 0; // 背景宽度
    //     verifyBlockValidateCode(pinCode)
    //       .then(res => {
    //         if (res.data.state == "100") {
    //           this.visible1 = true;
    //           setTimeout(() => {
    //             this.$refs.loginForm.validate(valid => {
    //               if (valid) {
    //                 this.loading = true;
    //                 this.loginForm.pinCode = pinCode;
    //                 this.$store
    //                   .dispatch("Login", this.loginForm)
    //                   .then(() => {
    //                     this.loading = false;
    //                     this.$router.push({
    //                       path: "/"
    //                     });
    //                   })
    //                   .catch(() => {
    //                     this.loading = false;
    //                     this.visible2 = false;
    //                     odiv.onmousemove = null; // 清除事件
    //                     this.visible1 = false;
    //                     this.refreshClick();
    //                   });
    //               } else {
    //                 this.visible1 = false;
    //                 this.refreshClick();
    //                 odiv.onmousemove = null; // 清除事件
    //                 odiv.onmouseup = null; // 清除事件
    //                 odiv.onmouseleave = null; // 清除事件
    //                 return false;
    //               }
    //             });
    //           }, 1500);
    //         } else {
    //           this.visible1 = false;
    //           this.refreshClick();
    //           odiv.onmousemove = null; // 清除事件
    //         }
    //       })
    //       .catch(() => {
    //         this.visible1 = false;
    //         odiv.onmousemove = null; // 清除事件
    //         this.refreshClick();
    //       });
    //   };
    //   odiv.onmouseleave = e => {
    //     tImageUrl.style.left = 12 + "px";
    //     odiv.style.left = 0; // 鼠标回到起始位置
    //     bgColor.style.width = 0; // 背景宽度
    //     odiv.onmousemove = null; // 清除事件
    //   };
    //   return false;
    // },
    // 点击显示明文密码
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    // 登录事件
    handleLogin() {
      if (this.loginForm.username == "" || this.loginForm.password == "") {
        this.$message({
          type: "error",
          message: "请填写完整信息"
        });
        this.visible2 = false;
        return;
      } else {
        this.visible2 = true;
        blockValidateCode()
          .then(res => {
            this.visible1 = false;
            this.codeData = res.data.result;
            this.imageUrl = res.data.result.image;
            this.oImageUrl = res.data.result.oImage;
            this.tImageUrl = res.data.result.tImage;
            this.yLength.top = res.data.result.yLength * 180 + 12 + "px";
            const odiv = document.querySelector("#slider");
            const tImageUrl = document.querySelector("#tImageUrl");
            // eslint-disable-next-line no-unused-vars
            const oImageUrl = document.querySelector("#oImageUrl");
            const bgColor = document.querySelector("#bgColor");
            odiv.style.left = 0;
            tImageUrl.style.left = 12 + "px";
            bgColor.style.width = 0;
          })
          .catch(() => {
            this.loading = false;
            this.visible1 = false;
          });
      }
    },
    logintext2() {
      if (this.loginForm.username === "" || this.loginForm.password === "") {
        // 账号或密码为空时限制登录
        this.$message({
          type: "error",
          message: "请填写完整信息"
        });
        this.visible2 = false;
        return;
      }
      this.loading = true;
      this.loginForm.pinCode = "12345";

      this.$store
        .dispatch("Login2", this.loginForm)
        .then(res => {
          this.loading = false;
          if (res.data.state == 100){
            this.$router.push({
              path: "/home/index"
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.visible2 = false;
          this.visible1 = false;
        });
    }
  }
};
</script>
<style>
</style>
<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #606266;
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

.videocontainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -100;
}
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
.slidingPictures {
  padding: 0;
  width: 300px;
  border-radius: 2px;
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

.track {
  margin-left: 7px;
  width: 286px;
  height: 38px;
  background: rgba(28, 136, 188, 0.5);
  border-radius: 25px;
  font-size: 14px;
  line-height: 38px;
  padding-right: 15px;
  padding-left: 70px;
}

.pintuTrue {
  background: #67c23a;
  color: #ffffff;
}

.button {
  position: absolute;
  width: 50px;
  height: 50px;
  line-height: 48px;
  background: #ffffff;
  box-shadow: #b9bdc8 0 0 3px;
  border-radius: 50%;
  left: 7px;
  text-align: center;
  font-size: 28px;
  color: #3e5d8b;
}
/* &:hover {
    color: #2181bd;
  } */

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

.container {
  padding-top: 100px;
  position: relative;
  display: flex;
  flex-flow: row wrap;
  .login-box {
    width: 400px;
    height: 300px;
  }
  .puzzle-box {
    position: absolute;
    // bottom: 0;
    // left: 0;
  }
  button {
    color: #fff;
    background-color: #50aad0;
    border-color: #50aad0;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    &:hover {
      border-color: #50aad0;
    }
  }
}

#box {
  position: relative;
  width: 320px;
  top: 35px;
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

.vimg {
  width: 300px;
  height: 150px;
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

#colorText {
  color: #1afa29;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  line-height: 35px;
}

#bigTitle {
  position: relative;
  top: 28%;
  left: 22%;
  color: white;
  font-size: 50px;
}

#whiteline {
  width: 30px;
  height: 5px;
  background-color: white;
  border-radius: 10px;
  position: relative;
  top: 25%;
  left: 22%;
}

#blueline {
  width: 30px;
  height: 4px;
  background-color: #00a1ea;
  border-radius: 10px;
  margin: 20px auto;
}

#smallTip {
  position: relative;
  top: 24%;
  left: 22%;
  color: white;
  font-size: 20px;
  letter-spacing: 4px;
}

.operation {
  font-size: 20px;
  position: relative;
  top: 40px;
}

#tick {
  height: 55px;
  width: 80px;
  margin-left: 47px;
}
</style>
