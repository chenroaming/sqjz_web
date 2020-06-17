<script>
import { changeCorrectionalpersonne } from "@/api/user";
import Getmap from "@/components/getmap/getmap";
import userFile from "@/components/userFile/userFile.vue";
import buttonBox from "./button.vue";
import {
  validatePassword,
  validateForbiChar,
  validatePhoneNumber,
  validateIdCard
} from "@/utils/validate";
// 身份证手机号校验
export default {
  filters: {},
  props: {
    dialogVisible: {
      default: false,
      type: Boolean,
      required: false
    }
  },
  components: {
    Getmap,
    userFile,
    buttonBox
  },
  data() {
    const checkName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        if (validateForbiChar(value)) {
          callback(new Error("姓名不能含有^@,&=*'.\"等关键字符"));
        }
        callback();
      }
    };
    const checkPhone = (rule, value, callback) => {
      if (value !== "" && validatePhoneNumber(value) === false) {
        callback(new Error("请输入正确格式的手机号"));
      } else {
        callback();
      }
    };
    const checkIdentityCard = (rule, value, callback) => {
      if (value !== "" && validateIdCard(value) === false) {
        callback(new Error("请输入正确格式的身份证号"));
      } else {
        // this.faceInfo.gender = parseInt(value.substr(16, 1)) % 2 === 1? 0 : 1;
        callback();
      }
    };
    return {
      isLoading: false,
      userType: [
        { id: 1, value: "宽管" },
        { id: 2, value: "普管" },
        { id: 3, value: "严管" }
      ],
      userType2: ["宽管", "普管", "严管"],
      activityRange: [{ id: 1, value: "区/县" }, { id: 2, value: "市" }],
      userFileList: [
        { fileType: 1, fileText: "基本信息表" },
        { fileType: 2, fileText: "定位监管承诺书" },
        { fileType: 3, fileText: "告知书" },
        { fileType: 4, fileText: "宣告书" },
        { fileType: 5, fileText: "责任书" },
        { fileType: 6, fileText: "软件监管承诺书" }
      ],
      imageUrl: "",
      userInfo: {
        activityRange: "",
        location: "",
        name: "",
        phone: "",
        identityCard: "",
        userType: "",
        livingArea: "",
        remark: "",
        id: ""
      },
      newFile: null,
      showMap: false,
      rules: {
        name: [
          { required: true, validator: checkName, trigger: ["blur", "change"] }
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur", "change"]
          }
        ],
        identityCard: [
          {
            required: true,
            message: "请输入身份证号",
            trigger: ["blur", "change"]
          }
        ],
        livingArea: [
          {
            required: true,
            message: "请输入居住小区",
            trigger: ["blur", "change"]
          }
        ],
        cause: [
          { required: true, message: "请输入案由", trigger: ["blur", "change"] }
        ]
      }
    };
  },
  mounted() {
    if (!this.$route.params.userId) {
      this.$router.push({ path: "/Communityuser/index" })
      return
    }
    this.userInfo = { ...this.$route.params }
    this.imageUrl = this.userInfo.picPath
  },
  methods: {
    // 获取到经纬度地图使用
    getPoint(val) {
      this.showMap = false;
      if (val) {
        this.userInfo.location = val.dw;
        this.userInfo.longitude = val.lng;
        this.userInfo.latitude = val.lat;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoading = true;
          const formData = new FormData();
          formData.append("picture", this.newFile);
          for (const i in this.userInfo) {
            formData.append(i, this.userInfo[i]);
          }
          changeCorrectionalpersonne(formData).then(res => {
            this.isLoading = false;
          });
        } else {
          return false;
        }
      });
    },
    // 预览文件
    handleAvatarChange(file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.newFile = file.raw;
    }
  }
};
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
  <div style="padding:10px">
    <router-link
      :to="{ path: '/Communityuser/index' }"
      style="margin-bottom:10px"
    >
      <el-button icon="el-icon-back" circle></el-button
      ><span style="margin-left:10px;">返回</span>
    </router-link>
    <el-card class="box-card" style="margin-top:10px">
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="false"
            name="picture"
            :on-change="handleAvatarChange"
            :show-file-list="false"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar"
              style="width:170px;height:200px"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
            <el-form-item label="姓名" prop="name" required class="formItem">
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
                  v-for="(item, index) in userType"
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
              ></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark" class="formItem">
              <el-input
                v-model="userInfo.remark"
                class="formInput"
                placeholder="备注"
              ></el-input>
            </el-form-item>
            <el-form-item label="居住位置" required class="formItem">
              <span>{{ userInfo.location }}</span>
              <!-- <el-input style="margin-top:10px" class="formInput" v-if="userInfo.dw !=''" :value="userInfo.dw" placeholder="地图经纬度信息" disabled/> -->
              <el-button type="primary" @click="showMap = true"
                >修改区域坐标</el-button
              >
            </el-form-item>
            <el-form-item class="formItem">
              <el-button
                type="success"
                @click="submitForm('userInforefs')"
                :loading="isLoading"
                >提 交</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <buttonBox :userInfo="userInfo"></buttonBox>
        </el-col>
      </el-row>
      <Getmap
        ref="getmapRefs"
        :value="showMap"
        @map-confirm="getPoint"
        @cancel="cancelPoint()"
      />
    </el-card>
    <el-card class="box-card" style="margin-top: 10px;">
      <div slot="header">
        <span>入矫文书材料</span>
      </div>
      <el-row :gutter="20">
        <el-col
          :span="8"
          v-for="(item, index) in userFileList"
          :key="index"
          style="margin-bottom:10px;"
        >
          <userFile
            style="width: 100%;"
            ref="userFile"
            :userId="userInfo.userId"
            :userFiles="userInfo.userFiles"
            :fileType="item.fileType"
            :fileText="item.fileText"
          ></userFile>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
