<template>
  <el-dialog
    title="修改用户信息"
    :visible.sync="dialogVisible"
    width="35%"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <el-form
      label-position="left"
      label-width="80px"
      :model="userInfo"
      :rules="rules"
      ref="userInforefs"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userInfo.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="userInfo.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="userInfo.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('modalClose')">取 消</el-button>
      <el-button type="primary" @click="submitForm('userInforefs')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { changeUser, changeUser2 } from "@/api/user";
export default {
  props: {
    dialogVisible: {
      default: false,
      type: Boolean,
      required: false
    }
  },

  data() {
    return {
      userInfo: {
        adminId: 0,
        username: '',
        name: '',
        phone:'',
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      }
    };
  },

  methods: {
    // 提交窗口
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          changeUser2(
            this.userInfo.adminId,
            this.userInfo.username,
            this.userInfo.name,
            this.userInfo.phone
          )
            .then(() => {
              this.$emit("submitSuccess");
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },

    receiveUserInfo(userInfo) {
      this.userInfo = { ...userInfo };
    }
  }
};
</script>

<style>
</style>
