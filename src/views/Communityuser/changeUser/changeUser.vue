<script>
import { changeCorrectionalpersonne, PersonnelCorrection } from '@/api/user'
import Getmap from '@/components/getmap/getmap'
import authmix from '@/utils/authmix'
import formMixin from '@/utils/communityuser'
import formItem from './formItem'
export default {
  name: 'ChangeUser',
  components: {
    Getmap,
    formItem
  },
  mixins: [authmix, formMixin],
  props: {
    getUserInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isLoading: false,
      userInfo: {
        returnTime: ''
      },
      newFile: null,
      showMap: false
    }
  },
  computed: {
    canEdit() {
      return this.checkPermission(['user:operate'])
    }
  },
  watch: {
    /* 因props值无法修改，且深拷贝绑定本组件data值时无法响应父组件变化，
      故监测props值是否发生变化，变化后将新的值赋值给本组件data，
      方便后续修改操作 */
    getUserInfo(cur, old) {
      this.userInfo = {
        ...cur,
        inTime: cur.createDate &&
          cur.createDate.time
          ? this.exChange2(cur.createDate.time) : '暂未入矫',
        outTime: cur.removeDate &&
          cur.removeDate.time
          ? this.exChange2(cur.removeDate.time) : '暂未解矫'
      }
    }
  },
  methods: {
    // 人员解矫
    PersonnelCorrection() {
      this.$confirm(`此操作将解矫人员【${this.userInfo.name}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PersonnelCorrection(this.userInfo.userId).then(({ data: { state, message }}) => {
          state === '100' && this.$message.success(message) && this.$router.push({ path: '/Communityuser/index' })
        })
      }).catch(() => {})
    },

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
          this.userInfo.returnTime = !this.userInfo.returnTime
            ? ''
            : this.userInfo.returnTime
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
    },
    checkItem(type = 'input') {
      return this.canEdit ? type : 'span' // 判断是否可编辑，返回相应的tagName
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
<style lang="scss">
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
        <i v-else class="el-icon-plus avatar-uploader-icon" />
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
          <formItem
            :v-value="userInfo.name"
            :type-name="checkItem()"
            :vmodel.sync="userInfo.name"
            placeholder="请输入姓名"
            class-name="formInput"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="identityCard" required class="formItem">
          <formItem
            :v-value="userInfo.identityCard"
            :type-name="checkItem()"
            :vmodel.sync="userInfo.identityCard"
            placeholder="请输入身份证号"
            class-name="formInput"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" required class="formItem">
          <formItem
            :v-value="userInfo.phone"
            :type-name="checkItem()"
            :vmodel.sync="userInfo.phone"
            placeholder="请输入手机号码"
            class-name="formInput"
          />
        </el-form-item>
        <el-form-item label="矫正类型" prop="correctType" class="formItem" required>
          <formItem
            :v-value="userInfo.correctType"
            :type-name="checkItem('select')"
            :select-arr="correctType"
            :vmodel.sync="userInfo.correctType"
            placeholder="请选择矫正类型"
            class-name="formInput"
          />
        </el-form-item>
        <el-form-item label="监管等级" prop="userType" required class="formItem">
          <formItem
            :v-value="userInfo.userType"
            :type-name="checkItem('select')"
            :select-arr="userType"
            :vmodel.sync="userInfo.userType"
            placeholder="请选择监管等级"
            class-name="formInput"
          />
        </el-form-item>
        <el-form-item label="活动范围" prop="activityRange" required class="formItem">
          <formItem
            :v-value="userInfo.activityRange"
            :type-name="checkItem('select')"
            :select-arr="activityRange"
            :vmodel.sync="userInfo.activityRange"
            placeholder="请选择活动范围"
            class-name="formInput"
          />
        </el-form-item>
        <el-form-item label="案由" prop="cause" required class="formItem">
          <formItem
            :v-value="userInfo.cause"
            :type-name="checkItem()"
            :vmodel.sync="userInfo.cause"
            placeholder="请输入案由"
            class-name="formInput"
          />
        </el-form-item>
        <el-form-item label="居住小区" prop="livingArea" required class="formItem">
          <formItem
            :v-value="userInfo.livingArea"
            :type-name="checkItem()"
            :vmodel.sync="userInfo.livingArea"
            placeholder="请输入居住小区"
            class-name="formInput"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark" class="formItem">
          <formItem
            :v-value="userInfo.remark"
            :type-name="checkItem()"
            :vmodel.sync="userInfo.remark"
            placeholder="请输入备注"
            class-name="formInput"
          />
        </el-form-item>
        <el-form-item label="工作情况" prop="workingCondition" class="formItem">
          <formItem
            :v-value="userInfo.workingCondition"
            :type-name="checkItem()"
            :vmodel.sync="userInfo.workingCondition"
            placeholder="请输入工作情况"
            class-name="formInput"
          />
        </el-form-item>
        <el-form-item label="入矫时间" prop="inTime" class="formItem">
          <span>{{ userInfo.inTime }}</span>
        </el-form-item>
        <el-form-item label="解矫时间" prop="outTime" class="formItem">
          <span>{{ userInfo.outTime }}</span>
        </el-form-item>
        <el-form-item label="居住位置" required class="formItem">
          <span>{{ userInfo.location }}</span>
          <el-button v-if="canEdit" type="text" @click="showMap = true">修改区域坐标</el-button>
        </el-form-item>
        <div style="width: 100%;text-align: center;float: left;">
          <el-button
            v-if="canEdit"
            :loading="isLoading"
            style="margin-top: 10px;"
            type="success"
            size="mini"
            @click="submitForm('userInforefs')"
          >提 交</el-button>

          <el-button
            v-if="canEdit"
            style="margin-top: 10px;"
            type="primary"
            size="mini"
            @click="PersonnelCorrection"
          >人员解矫</el-button>
        </div>
      </el-form>
    </el-col>
    <Getmap ref="getmapRefs" :value="showMap" @map-confirm="getPoint" @cancel="cancelPoint()" />
  </div>
</template>
