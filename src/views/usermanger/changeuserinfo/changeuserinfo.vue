<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
    title="修改用户信息"
    width="35%"
  >
    <el-form
      ref="userInforefs"
      :model="userInfo"
      :rules="rules"
      label-position="left"
      label-width="80px"
    >
      <el-form-item label="照片" prop="avatar">
        <el-upload
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleChange"
          class="avatar-uploader"
          action="#">
          <img v-if="userInfo.picPath" :src="userInfo.picPath" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userInfo.username" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="userInfo.name" placeholder="请输入姓名"/>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="userInfo.phone" placeholder="请输入手机号"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('modalClose')">取 消</el-button>
      <el-button :loading="isLoading" type="primary" @click="submitForm('userInforefs')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { changeUser2 } from '@/api/user'
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
      userInfo: {},
      isLoading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      }
    }
  },

  methods: {
    // 提交窗口
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoading = true
          const formData = new FormData()
          for (const i in this.userInfo) {
            formData.append(i, this.userInfo[i])
          }
          changeUser2(formData)
            .then(({ data: { state }}) => {
              this.isLoading = false
              state === '100' && this.$emit('submitSuccess')
            })
            .catch(() => {})
        }
      })
    },
    receiveUserInfo(userInfo) {
      this.userInfo = { ...userInfo, picture: undefined }
    },
    // 预览文件
    handleChange(fileSrc, fileList) {
      this.userInfo.picture = fileSrc.raw
      this.userInfo.picPath = URL.createObjectURL(fileSrc.raw)
    }
  }
}
</script>

<style>
</style>
