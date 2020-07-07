<script>
import { changeCorrectionalpersonne } from '@/api/user'
import Getmap from '@/components/getmap/getmap'
import authmix from '@/utils/authmix'
import { checkName, checkPhone, checkIdentityCard } from '@/utils/validate'
export default {
  name: 'ChangeUser',
  components: {
    Getmap
  },
  mixins: [authmix],
  props: {
    getUserInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isLoading: false,
      userType: [
        { id: 1, value: '宽管' },
        { id: 2, value: '普管' },
        { id: 3, value: '严管' }
      ],
      userType2: ['宽管', '普管', '严管'],
      activityRange: [{ id: 1, value: '区/县' }, { id: 2, value: '市' }],
      userInfo: {
        returnTime: ''
      },
      newFile: null,
      showMap: false,
      rules: {
        name: [
          { validator: checkName, trigger: ['blur', 'change'] }
        ],
        phone: [
          {
            validator: checkPhone,
            trigger: ['blur', 'change']
          }
        ],
        identityCard: [
          {
            validator: checkIdentityCard,
            trigger: ['blur', 'change']
          }
        ],
        livingArea: [
          {
            required: true,
            message: '请输入居住小区',
            trigger: ['blur', 'change']
          }
        ],
        cause: [
          { required: true, message: '请输入案由', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  watch: {
    /* 因props值无法修改，且深拷贝绑定本组件data值时无法响应父组件变化，
      故监测props值是否发生变化，变化后将新的值赋值给本组件data，
      方便后续修改操作 */
    getUserInfo(cur, old) {
      this.userInfo = cur
    }
  },
  methods: {
    getPoint(val) {
      this.showMap = false
      if (val) {
        this.userInfo.location = val.dw
        this.userInfo.longitude = val.lng
        this.userInfo.latitude = val.lat
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoading = true
          this.userInfo.returnTime = !this.userInfo.returnTime ? '' : this.userInfo.returnTime
          const formData = new FormData()
          formData.append('picture', this.newFile)
          for (const i in this.userInfo) {
            formData.append(i, this.userInfo[i])
          }
          changeCorrectionalpersonne(formData).then(res => {
            this.isLoading = false
          })
        } else {
          return false
        }
      })
    },
    // 预览文件
    handleAvatarChange(file, fileList) {
      this.userInfo.picPath = URL.createObjectURL(file.raw)
      this.newFile = file.raw
    },
    cancelPoint(e) {
      this.showMap = e
    }
  }
}
</script>

<style>
  /* 头像上传样式 */
  .avatar-uploader {
    /* margin-left: 100px; */
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
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
  .formItem {
    width: 50%;
    float: left;
    .formInput {
      width: 200px;
    }
  }
</style>

<template>
  <div>
    <el-col :span="3">
      <el-upload
        :auto-upload="false"
        :on-change="handleAvatarChange"
        :show-file-list="false"
        class="avatar-uploader"
        action="#"
        name="picture"
      >
        <img
          v-if="userInfo.picPath"
          :src="userInfo.picPath"
          class="avatar"
          style="width:170px;height:200px"
        >
        <i v-else class="el-icon-plus avatar-uploader-icon"/>
      </el-upload>
    </el-col>
    <el-col :span="13">
      <el-form
        ref="userInforefs"
        :rules="rules"
        :model="userInfo"
        size="mini"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="姓名" prop="name" class="formItem" required>
          <el-input
            v-model="userInfo.name"
            class="formInput"
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item
          label="身份证号"
          prop="identityCard"
          required
          class="formItem"
        >
          <el-input
            v-model="userInfo.identityCard"
            class="formInput"
            placeholder="请输入身份证号"
          />
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="phone"
          required
          class="formItem"
        >
          <el-input
            v-model="userInfo.phone"
            class="formInput"
            placeholder="请输入手机号码"
          />
        </el-form-item>
        <el-form-item
          label="人员类型"
          prop="userType"
          required
          class="formItem"
        >
          <el-select
            v-model="userInfo.userType"
            class="formInput"
            placeholder="人员类型"
          >
            <el-option
              v-for="item in userType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="活动范围"
          prop="activityRange"
          required
          class="formItem"
        >
          <el-select
            v-model="userInfo.activityRange"
            class="formInput"
            placeholder="活动范围"
          >
            <el-option
              v-for="(item, index) in activityRange"
              :key="index"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="案由" prop="cause" required class="formItem">
          <el-input
            v-model="userInfo.cause"
            class="formInput"
            placeholder="请输入案由"
          />
        </el-form-item>
        <el-form-item
          label="居住小区"
          prop="livingArea"
          required
          class="formItem"
        >
          <el-input
            v-model="userInfo.livingArea"
            class="formInput"
            placeholder="居住小区"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark" class="formItem">
          <el-input
            v-model="userInfo.remark"
            class="formInput"
            placeholder="备注"
          />
        </el-form-item>
        <el-form-item label="居住位置" required class="formItem">
          <span>{{ userInfo.location }}</span>
          <el-button
            type="text"
            @click="showMap = true"
          >修改区域坐标</el-button
          >
        </el-form-item>
        <el-form-item label="工作情况" prop="workingCondition" class="formItem">
          <el-input
            v-model="userInfo.workingCondition"
            class="formInput"
            placeholder="请输入工作情况" />
        </el-form-item>
        <div
          style="width: 100%;text-align: center;float: left;">
          <el-button
            v-if="checkPermission(['user:operate'])"
            :loading="isLoading"
            style="margin-top: 10px;"
            type="success"
            size="mini"
            @click="submitForm('userInforefs')"
          >提 交</el-button
          >
        </div>
      </el-form>
    </el-col>
    <Getmap
      ref="getmapRefs"
      :value="showMap"
      @map-confirm="getPoint"
      @cancel="cancelPoint()"
    />
  </div>
</template>
