<template>
  <el-dialog
    title="新增权限"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    width="40%">
    <el-form label-position="left" label-width="120px" :model="authInfo" :rules="rules" ref="auth_form_add">
      <el-form-item label="权限名称" prop="authorityName">
        <el-input v-model="authInfo.authorityName"></el-input>
      </el-form-item>
      <el-form-item label="上级权限" prop="authId">
        <el-select filterable v-model="authInfo.authId" placeholder="请选择所属权限" style="width:100%">
          <el-option
            v-for="item in authList"
            :key="item.id"
            :label="item.authorityName"
            :value="item.id">
            <span style="float: left">{{ item.authorityName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.parentId | getAuthIndex }}</span>
          </el-option>
        </el-select>
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
      <el-button type="primary" @click="handleSubmit('auth_form_add')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addAuth } from "@/api/auth";
export default {
  props: {
    dialogVisible:{
      type: Boolean,
      default: false,
    },
  },

  filters: {
    getAuthIndex (val) {
      if (val === 0) {
        return '总权限'
      } else if (val === 1) {
        return '一级权限'
      } else {
        return '二级权限'
      }
    }
  },

  data () {
    return {
      type: 'CHANGE_ROLE',
      authList: [],
      authInfo: {
        authId: null,
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
        ],
        authId: [
          { required: true, message: '请选择上级权限', trigger: 'blur' },
        ]
      }
    }
  },

  methods: {
    // 接收信息
    sendAuthInfo (authList) {
      this.authList = authList;
    },

    // 关闭
    handleClose () {
      this.$refs.auth_form_add.resetFields();
      this.$emit('closeModal');
    },

    // 提交
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addAuth(this.authInfo.authorityName, this.authInfo.authorityCode, this.authInfo.authId, this.authInfo.authorityUrl)
          .then(res=>{
            this.$message({type:'success', message:'新增成功'});
            this.$refs.auth_form_add.resetFields();
            this.$emit('submitSuccess');
          }).catch(()=>{});
        }
      });
    },
  }
}
</script>

