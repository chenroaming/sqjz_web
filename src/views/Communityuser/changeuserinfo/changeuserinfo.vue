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
      <el-form-item label="人脸照片" prop="picPath2">
        <div class="uploadImage">
          <div class="uploadImage-block" @click="is_yl">
            <el-upload
              ref="upload"
              :file-list="imagelist"
              :multiple="false"
              :auto-upload="false"
              :data="userInfo"
              :on-change="handleChange"
              :on-success="handleSuccess"
              :show-file-list="false"
              class="avatar-uploader"
              name="picture"
              style="float:left;margin-right:20px"
              action="/community_correction/webClass/user/update.jhtml"
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
      <el-form-item label="姓名" prop="name" required>
        <el-input v-model="userInfo.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="备注" prop="remark" >
        <el-input v-model="userInfo.remark" placeholder="备注"/>
      </el-form-item>
      <el-form-item label="身份证号" prop="identityCard" required>
        <el-input v-model="userInfo.identityCard" placeholder="请输入身份证号" />
      </el-form-item>

      <el-form-item label="手机号码" prop="phone" required>
        <el-input v-model="userInfo.phone" placeholder="请输入手机号码" />
      </el-form-item>

      <el-form-item label="人员类型" prop="userType" required>
        <el-select v-model="userInfo.userType" placeholder="人员类型">
          <el-option
            v-for="(item, index) in userType"
            :key="index"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="活动范围" prop="activityRange" required>
        <el-select v-model="userInfo.activityRange" placeholder="人员类型">
          <el-option
            v-for="(item, index) in activityRange"
            :key="index"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="案由" prop="cause" required>
        <el-input v-model="userInfo.cause" placeholder="请输入案由" />
      </el-form-item>
      <el-form-item label="区域位置" required>
        <el-input
          v-if="userInfo.dw !=''"
          :value="userInfo.dw"
          style="margin-top:10px"
          placeholder="位置信息"
          disabled
        />
        <el-button
          type="primary"
          size="mini"
          @click="showMap = true"
        >修改区域坐标</el-button>
      </el-form-item>
      <el-form-item label="居住小区" prop="livingArea" required>
        <el-input v-model="userInfo.livingArea" placeholder="居住小区"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('modalClose')">取 消</el-button>
      <el-button type="primary" @click="submitForm('userInforefs')">确 定</el-button>
    </span>
    <Getmap ref="getmapRefs" :value="showMap" @map-confirm="getPoint" @cancel="cancelPoint()" />
  </el-dialog>
</template>

<script>
import { changeCorrectionalpersonne } from '@/api/user'
import Getmap from '@/components/getmap/getmap'
import {
  // eslint-disable-next-line no-unused-vars
  validatePassword,
  validateForbiChar,
  validatePhoneNumber,
  validateIdCard
} from '@/utils/validate'
// 身份证手机号校验

const taskTypeList = [
  { id: '1', value: '宽管' },
  { id: '2', value: '普管' },
  { id: '3', value: '严管' }
]

export default {
  filters: {},
  components: {
    Getmap
  },
  props: {
    dialogVisible: {
      default: false,
      type: Boolean,
      required: false
    }
  },
  data() {
    // 名字检验正则
    var checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入姓名'))
      } else {
        if (validateForbiChar(value)) {
          callback(new Error("姓名不能含有^@,&=*'.\"等关键字符"))
        }
        callback()
      }
    }
    var checkPhone = (rule, value, callback) => {
      if (value !== '' && validatePhoneNumber(value) === false) {
        callback(new Error('请输入正确格式的手机号'))
      } else {
        callback()
      }
    }
    var checkIdentityCard = (rule, value, callback) => {
      if (value !== '' && validateIdCard(value) === false) {
        callback(new Error('请输入正确格式的身份证号'))
      } else {
        // this.faceInfo.gender = parseInt(value.substr(16, 1)) % 2 === 1? 0 : 1;
        callback()
      }
    }
    return {
      userType: taskTypeList,
      activityRange: [{ id: 1, value: '区/县' }, { id: 2, value: '市' }],
      // 矫正对象活动范围
      showMap: false,
      userInfo: {
        activityRange: '',
        dw: '',
        name: '',
        phone: '',
        identityCard: '',
        userType: '',
        livingArea: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, validator: checkName, trigger: ['blur', 'change'] }],
        phone: [{ required: true, message: '请输入手机号', trigger: ['blur', 'change'] }],
        identityCard: [
          { message: '请输入身份证号', trigger: ['blur', 'change'] }
        ],
        livingArea: [
          { required: true, message: '请输入居住小区', trigger: ['blur', 'change'] }
        ]
      },
      imagelist: [],
      isUpload: false,
      baseUrl: '',
      newFile: null
    }
  },

  methods: {
    // 提交窗口
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.userInfo.userType) {
            case '宽管':
              this.userInfo.userType = 1
              break
            case '普管':
              this.userInfo.userType = 2
              break
            case '严管':
              this.userInfo.userType = 3
              break
            case '暂予监外执行':
              this.userInfo.userType = 4
              break
          }
          // console.log(this.userInfo.activityRange);
          // console.log(this.regactivityRange(this.userInfo.activityRange));

          // return false;
          const formData = new FormData()
          // const formData2 = new FormData();
          // for (let i in this.userInfo){
          //   formData2.append(i,this.userInfo[i])
          // }
          formData.append('userId', this.userInfo.userId)
          formData.append('name', this.userInfo.name)
          formData.append('identityCard', this.userInfo.identityCard)
          formData.append('phone', this.userInfo.phone)
          formData.append('cause', this.userInfo.cause)
          formData.append('userType', this.userInfo.userType)
          formData.append('correct', true)
          formData.append('activityRange', this.userInfo.activityRange)
          formData.append('longitude', this.userInfo.longitude)
          formData.append('latitude', this.userInfo.latitude)
          formData.append('livingArea', this.userInfo.livingArea)
          formData.append('remark', this.userInfo.remark)
          formData.append('picture', this.newFile)
          changeCorrectionalpersonne(formData)
            .then(res => {
              res.data.state == 100 && this.$emit('submitSuccess')
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    // 获取到经纬度地图使用
    getPoint(val) {
      this.showMap = false
      if (val) {
        this.userInfo.dw = val.dw
        this.userInfo.longitude = val.lng
        this.userInfo.latitude = val.lat
      }
    },
    // 地图使用
    cancelPoint() {
      this.showMap = false
    },
    // regactivityRange(val) {
    //   console.log(val)
    //   return this.activityRange2.get(val);
    //   for(this.activityRange)
    //   for (let index = 0; index < this.activityRange.length; index++) {
    //     // console.log(this.activityRange[index].value);
    //     if (val == this.activityRange[index].id) {
    //       return this.activityRange[index].value;
    //     } else if (val == this.activityRange[index].value) {
    //       return this.activityRange[index].id;
    //     }
    //   }
    // },

    receiveUserInfo(userInfo) {
      console.log(userInfo)
      this.imagelist = []
      if (userInfo.cause == null) {
        userInfo.cause = '暂无'
      }
      switch (userInfo.userType) {
        case 1:
          userInfo.userType = '宽管'
          break
        case 2:
          userInfo.userType = '普管'
          break
        case 3:
          userInfo.userType = '严管'
          break
        case 4:
          userInfo.userType = '暂予监外执行'
          break
      }
      this.userInfo = { ...userInfo }
    },
    // 预览文件
    handleChange(fileSrc, fileList) {
      this.newFile = fileSrc.raw
      var _this = this
      _this.mutiZip = fileSrc.raw
      const ary = []
      ary.push(fileSrc)
      _this.imagelist = ary
      _this.userInfo.picPath2 = ary
      var event = event || window.event
      console.log('event出现')
      if (_this.show_Photo == '1') {
        if (event.target.files[0]) {
          var file = event.target.files[0]
          var reader = new FileReader()
          // 转base64
          reader.onload = function(e) {
            _this.baseUrl = e.target.result // 将图片路径赋值给src
            _this.isUpload = true // 将图片路径赋值给src
            _this.isSelectFile = true
          }
          reader.readAsDataURL(file)
        }
      }
    },
    handleSuccess(response, imageFile, fileList) {
      console.log(response)
      if (response.state == 100) {
        this.$message.error(response.message)
        this.handleReset()
        this.$emit('submitSuccess')
        return false
      } else {
        this.show_Photo = '0'
        this.isUpload = false
        this.$message.error(response.message)
        this.handleReset()
        return false
      }
    },
    is_yl() {
      this.show_Photo = '1'
    }
  }
}
</script>

<style>
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
  .uploadImage-block:last-child {
    border: 0;
  }
</style>
