<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    :role-type="roleType"
    title="新建用户"
    width="35%"
  >
    <el-form
      ref="addusermodalrefs"
      :model="userInfo"
      :rules="rules"
      label-position="left"
      label-width="95px"
    >
      <el-form-item label="照片" prop="avatar">
        <el-upload
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleChange"
          class="avatar-uploader"
          action="#">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="isJudiciary" label="角色类型" prop="roleType">
        <el-select v-model="userInfo.roleType" placeholder="请选择">
          <el-option
            v-for="item in roleArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-else label="司法所选择" prop="communityId">
        <el-select v-model="userInfo.communityId" filterable placeholder="请选择司法所">
          <el-option
            v-for="(item, index) in communityId"
            :key="index"
            :label="item.communityName"
            :value="item.communityId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userInfo.username" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userInfo.password" placeholder="请输入密码" show-password/>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="userInfo.name" placeholder="请输入姓名"/>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="userInfo.phone" placeholder="请输入手机号码" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button :loading="isLoding" type="primary" @click="handleSubmit('addusermodalrefs')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getcommunity } from '@/api/community'
import { getRoleList2 } from '@/api/role'
import { addUser2 } from '@/api/user'
import { checkPhone, checkPassword } from '@/utils/validate'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    roleType: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      imageUrl: '',
      isLoding: false,
      roleArr: [{ value: 6, label: '助理员' }, { value: 7, label: '协理员' }],
      pwdType: 'password',
      userInfo: {
        username: '',
        password: '',
        name: '',
        roleType: null,
        communityId: '',
        phone: '',
        picture: undefined
      },
      communityId: [],
      roleList: [],
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['change', 'blur']
          }
        ],
        roleType: [
          {
            required: true,
            message: '请选择人员类型',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          {
            trigger: ['change', 'blur'],
            validator: checkPassword
          }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: ['change', 'blur'] }
        ],
        phone: [
          { validator: checkPhone, trigger: ['change', 'blur'] }
        ],
        communityId: [
          {
            required: true,
            message: '请选择人员所属司法所',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  computed: {
    isJudiciary() {
      return this.$store.getters.roleType == 5
    }
  },
  methods: {
    // 初始化
    __init() {
      this.$store.getters.roleType != 5 && this.fetchGetAreaList()
      // this.fetchGetRoleList();
    },

    // 提交
    handleSubmit(formName) {
      console.log(this.userInfo)
      this.$refs[formName].validate(valid => {
        if (valid) {
          const formData = new FormData()
          for (const i in this.userInfo) {
            formData.append(i, this.userInfo[i])
          }
          this.isLoding = true
          addUser2(formData)
            .then(res => {
              this.isLoding = false
              if (res.data.state === '100') {
                this.$emit('submitSuccess')
                this.$refs[formName].resetFields()
              }
            })
            .catch(() => {})
        }
      })
    },

    // 获取区域列表
    fetchGetAreaList() {
      console.log('调用')
      getcommunity(100, 1)
        .then(res => {
          this.communityId = res.data.list
        })
        .catch(() => {})
    },

    // 获取角色列表
    fetchGetRoleList() {
      getRoleList2()
        .then(res => {
          console.log(res)
          this.roleList = res.data.list
        })
        .catch(() => {})
    },

    // 关闭弹窗
    handleClose() {
      this.$refs['addusermodalrefs'].resetFields()
      this.$emit('closeModal')
    },

    // 预览文件
    handleChange(fileSrc, fileList) {
      this.userInfo.picture = fileSrc.raw
      this.imageUrl = URL.createObjectURL(fileSrc.raw)
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style lang="scss" scoped>
.show-pwd {
  position: absolute;
  right: 14px;
  z-index: 2019;
}
</style>
