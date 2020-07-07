<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    width="40%"
  >
    <el-form
      ref="rolesettings_form"
      :model="roleInfo"
      :rules="rules"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleInfo.roleName"/>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roleInfo.description"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleSubmit('rolesettings_form')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addRole2, updateRole2 } from '@/api/role'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '修改人脸'
    }
  },

  data() {
    return {
      type: 'CHANGE_ROLE',
      roleInfo: {
        roleId: '',
        roleName: '',
        description: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // 接收信息
    sendRoleInfo(type, payload) {
      this.type = type
      this.roleInfo = { ...payload }
    },

    // 关闭
    handleClose() {
      this.$refs.rolesettings_form.resetFields()
      this.$emit('closeModal')
    },

    // 提交
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.type === 'CHANGE_ROLE') {
            this.handleChangeRole()
          } else {
            this.handleAddRole()
          }
        }
      })
    },

    // 修改用户
    handleChangeRole() {
      updateRole2(
        this.roleInfo.roleId,
        this.roleInfo.roleName,
        this.roleInfo.description
      )
        .then(res => {
          this.$emit('requestSuccess')
        })
        .catch(() => {})
    },

    // 新增用户
    handleAddRole() {
      addRole2(this.roleInfo.roleName, this.roleInfo.description)
        .then(res => {
          this.$emit('requestSuccess')
        })
        .catch(() => {})
    }
  }
}
</script>

