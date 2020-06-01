<template>
  <el-dialog
    title="修改权限"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    width="40%">
    <el-form label-position="left" label-width="120px" :model="authInfo" :rules="rules" ref="auth_form">
      <el-form-item label="权限名称" prop="authorityName">
        <el-input v-model="authInfo.authorityName"></el-input>
      </el-form-item>
      <el-form-item label="权限代码" prop="authorityCode">
        <el-input v-model="authInfo.authorityCode"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径">
        <el-input v-model="authInfo.authorityUrl"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleSubmit('auth_form')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { changeAuth } from "@/api/auth";
export default {
  props: {
    dialogVisible:{
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      type: 'CHANGE_ROLE',
      authInfo: {
        id: '',
        authorityName: '',
        authorityCode: '',
        authorityUrl: '',
      },
      rules: {
        authorityName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
        ],
        authorityCode: [
          { required: true, message: '请输入权限代码', trigger: 'blur' },
        ]
      }
    }
  },

  methods: {
    // 接收信息
    sendAuthInfo (payload) {
      this.authInfo = {...payload};
    },

    // 关闭
    handleClose () {
      this.$refs.auth_form.resetFields();
      this.$emit('closeModal');
    },

    // 提交
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changeAuth(this.authInfo.id, this.authInfo.authorityName, this.authInfo.authorityCode, this.authInfo.authorityUrl)
          .then(res=>{
            this.$message({type:'success', message:'修改成功'});
            this.$emit('submitSuccess');
          }).catch(()=>{});
        }
      });
    },
  }
}
</script>

