<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    :role-type="roleType"
    title="新增矫正对象"
    width="35%"
    top="1%"
  >
    <el-form
      ref="addusermodalrefs"
      :model="userInfo"
      :rules="rules"
      label-position="left"
      label-width="115px"
    >
      <el-form-item label="人脸照片" prop="picPath2">
        <div class="uploadImage">
          <div class="uploadImage-block" @click="is_yl">
            <el-upload
              ref="upload"
              :multiple="false"
              :file-list="imageList"
              :auto-upload="false"
              :data="userInfo"
              :on-change="handleChange"
              :on-success="handleSuccess"
              :show-file-list="false"
              class="avatar-uploader"
              name="picture"
              style="float:left;margin-right:20px"
              action="/community_correction/webClass/user/add.jhtml"
            >
              <img v-show="isUpload" :src="baseUrl" class="avatar" style="width:200px;height:200px" >
              <i
                v-show="!isUpload"
                class="el-icon-plus avatar-uploader-icon"
                style="width:200px;height:200px"
              />
            </el-upload>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="userInfo.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="备注" prop="remark" >
        <el-input v-model="userInfo.remark" placeholder="备注"/>
      </el-form-item>
      <el-form-item label="身份证号" prop="identityCard">
        <el-input v-model="userInfo.identityCard" placeholder="请输入身份证号" />
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="userInfo.phone" placeholder="请输入手机号码" />
      </el-form-item>

      <el-form-item label="矫正类型" prop="correctType" required>
        <el-select v-model="userInfo.correctType" placeholder="请选择矫正类型">
          <el-option
            v-for="(item, index) in correctType"
            :key="index"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="监管等级" prop="userType" required>
        <el-select v-model="userInfo.userType" placeholder="请选择监管等级">
          <el-option
            v-for="(item, index) in userType"
            :key="index"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="活动范围" prop="activityRange" required>
        <el-select v-model="userInfo.activityRange" placeholder="请选择活动范围">
          <el-option
            v-for="(item, index) in activityRange"
            :key="index"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="罪名" prop="cause">
        <el-input v-model="userInfo.cause" placeholder="请输入罪名" />
      </el-form-item>
      <!-- 预览照片 -->
      <el-form-item label="居住小区" prop="livingArea" required>
        <el-input v-model="userInfo.livingArea" placeholder="居住小区"/>
      </el-form-item>
      <el-form-item label="区域位置" prop="dw" required>
        <p style="margin: 0;">{{ userInfo.dw }}</p>
        <el-button
          type="primary"
          size="mini"
          @click="showMap = true"
        >{{ buttontext }}</el-button>
      </el-form-item>

      <el-form-item label="工作情况" prop="workingCondition">
        <el-input v-model="userInfo.workingCondition" placeholder="请输入工作情况" />
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button :loading="isLoading" type="primary" @click="handleSubmit('addusermodalrefs')">提交</el-button>
    </span>
    <Getmap ref="getmapRefs" :value="showMap" @map-confirm="getPoint" @cancel="cancelPoint()" />
  </el-dialog>
</template>

<script>
// 地图坐标抓取
import Getmap from '@/components/getmap/getmap'
// eslint-disable-next-line no-unused-vars
import { getAreaList2 } from '@/api/area'
// eslint-disable-next-line no-unused-vars
import { getRoleList, getRoleList2 } from '@/api/role'
// eslint-disable-next-line no-unused-vars
import { addUser } from '@/api/user'
import formMixin from '@/utils/communityuser'
export default {
  components: {
    Getmap
  },
  mixins: [formMixin],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    dialogVisible: false,
    // eslint-disable-next-line vue/require-default-prop
    roleType: 0
  },

  data() {
    return {
      isLoading: false,
      show_Photo: '1',
      // 图片预览控制
      showMap: false,
      // 控制地图抓取显示
      pwdType: 'password',
      userInfo: {
        name: '',
        identityCard: '',
        // 身份证号
        phone: '',
        // 手机号
        userType: 1,
        // 人员类型
        activityRange: 2,
        // 活动范围
        correctType: 1,
        // 矫正类型
        dw: '',
        cause: '',
        // 备注
        correct: true,
        // 案由
        longitude: '',
        // 经度
        latitude: '',
        // 纬度
        livingArea: '', // 居住小区
        remark: '', // 备注
        workingCondition: '' // 工作情况
      },
      areaList: [],
      // 图片上传
      // ---------------------------------------------------------
      imageList: [], // 上传列表
      isUpload: false,
      isSelectFile: false, // 是否已经选择要上传的文件
      isimg: false,
      mutiZip: {},
      baseUrl: '',
      avatar: null
    }
  },
  computed: {
    buttontext() {
      return this.userInfo.longitude && this.userInfo.latitude ? '修改区域坐标' : '添加区域坐标'
    }
  },
  methods: {
    // 初始化
    __init() {
      this.show_Photo = '1'
      // console.log("初始化中");
    },

    is_yl() {
      this.show_Photo = '1'
    },
    // 地图使用
    cancelPoint() {
      this.showMap = false
    },
    // 获取到经纬度地图使用
    getPoint(val) {
      this.showMap = false
      console.log(val)
      console.log('现在的坐标是')
      if (val) {
        this.userInfo.dw = val.dw
        this.userInfo.longitude = val.lng
        this.userInfo.latitude = val.lat
      }
    },
    // 提交
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return this.$message.error('请正确输入内容')
        }
        if (this.isUpload === false) {
          this.$message.error('请上传人脸照片')
        } else {
          this.isLoading = true
          const formData = new FormData()
          formData.append('picture', this.avatar)
          for (const i in this.userInfo) {
            formData.append(i, this.userInfo[i])
          }
          addUser(formData).then(({ data: { state }}) => {
            this.isLoading = false
            state === '100' && this.handleSuccess()
          })
        }
      })
    },
    // 预览文件
    handleChange(fileSrc, fileList) {
      this.avatar = fileSrc.raw
      this.baseUrl = URL.createObjectURL(fileSrc.raw)
      this.isUpload = true
      this.isSelectFile = true
    },

    // 上传成功
    handleSuccess(response) {
      this.$emit('submitSuccess')
      this.handleReset()
    },
    // 重置
    handleReset() {
      this.show_Photo = '0'
      this.$refs['addusermodalrefs'].resetFields()
      this.isUpload = false
      this.isSelectFile = false // 是否已经选择要上传的文件
      this.imageList = []
      this.isimg = false
      this.mutiZip = {}
      this.baseUrl = ''
      this.userInfo = {
        name: '',
        identityCard: '',
        cause: '',
        longitude: '',
        latitude: '',
        correct: true,
        userType: 1,
        // 人员类型
        activityRange: 2,
        // 活动范围
        correctType: 1
      }
    },

    // 关闭弹窗
    handleClose() {
      this.handleReset()
      this.$emit('update:closeModal', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.uploadImage {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 20px;

  &-block {
    display: flex;
    flex-direction: row;
    margin-right: 20px;
    padding: 0 10px 0 10px;
    border-right: 1px solid #eee;
    position: relative;
  }

  .uploadImage-block:last-child {
    border: 0;
  }

  .deleteBtn {
    position: absolute;
    bottom: -20px;
    left: 72px;
  }
}

.originImage {
  margin-right: 10px;
  width: 150px;
  height: 190px;
  border: 1px dashed #d9d9d9;
}
</style>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 190px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 150px;
  height: 190px;
  display: block;
}

/* .loading-mask {
  width: 150px;
  height: 190px;
  background: rgba(0, 0, 0, 0);
  opacity: 0.2;
  position: absolute;
  animation: fadeIn 0.3s linear forwards;
  transform: all 0.5s ease;
}

.loading-mask-circle {
  width: 20px;
  height: 20px;
  background: #409eff;
  border-radius: 20px;
  transform: translate(-50%, -50%);
  position: absolute;
  left: 44%;
  top: 44%;
  opacity: 1;
  animation: scale 1s infinite ease-in-out forwards;
}

@keyframes scale {
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    background: rgba(0, 0, 0, 0);
    opacity: 0.2;
  }

  to {
    background: rgba(0, 0, 0, 0.5);
    opacity: 1;
  }
} */
</style>
