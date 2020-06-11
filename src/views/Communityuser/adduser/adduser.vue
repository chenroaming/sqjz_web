<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    :role-type="roleType"
    title="新增矫正人员"
    width="35%"
    top="1%"
  >
    <el-form
      ref="addusermodalrefs"
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
              action="/community_correction/webClass/user/add.jhtml"
            >
              <img v-show="isUpload" :src="baseUrl" class="avatar" style="width:200px;height:200px" />
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
        <el-input v-model="userInfo.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="identityCard">
        <el-input v-model="userInfo.identityCard" placeholder="请输入身份证号" />
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
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
        <el-select v-model="userInfo.activityRange" placeholder="活动范围">
          <el-option
            v-for="(item, index) in activityRange"
            :key="index"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="案由" prop="cause">
        <el-input v-model="userInfo.cause" placeholder="请输入案由" />
      </el-form-item>
      <!-- 预览照片 -->
      <el-form-item label="居住小区" prop="livingArea" required>
        <el-input v-model="userInfo.livingArea" placeholder="居住小区"></el-input>
      </el-form-item>
      <el-form-item label="区域位置" required>
        <!-- <el-input
          v-if="userInfo.longitude !='' && userInfo.longitude !=''"
          :value="'经度：'+userInfo.longitude+';纬度：'+userInfo.latitude"
          placeholder="区域坐标"
          disabled
        /> -->
        <el-input
          style="margin-top:10px"
          v-if="userInfo.dw !=''"
          :value="userInfo.dw"
          placeholder="位置信息"
          disabled
        />
        <el-button
          v-if="userInfo.longitude =='' && userInfo.longitude ==''"
          type="primary"
          size="mini"
          @click="showMap = true"
        >添加区域坐标</el-button>
        <el-button
          v-if="userInfo.longitude !='' && userInfo.longitude !=''"
          type="primary"
          size="mini"
          @click="showMap = false"
        >修改区域坐标</el-button>
      </el-form-item>
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleSubmit('addusermodalrefs')">提交</el-button>
    </span>
    <Getmap ref="getmapRefs"  :value="showMap" @map-confirm="getPoint" @cancel="cancelPoint()" />

    <!-- <Getmap ref="getmapRefs" :value="showMap" @map-confirm="getPoint" /> -->
  </el-dialog>
</template>

<script>
// 地图坐标抓取
// import Getmap from "@/components/getmap/getmap";

import Getmap from "@/components/getmap/getmap";
import { getAreaList2 } from "@/api/area";
// eslint-disable-next-line no-unused-vars
import { getRoleList, getRoleList2 } from "@/api/role";
// eslint-disable-next-line no-unused-vars
import { addUser2 } from "@/api/user";
import {
  validatePassword,
  validateForbiChar,
  validatePhoneNumber,
  validateIdCard
} from "@/utils/validate";
// 身份证手机号校验

// 矫正人员类型
const userType = [
  { id: "1", value: "宽管" },
  { id: "2", value: "普管" },
  { id: "3", value: "严管" }
];
// 矫正人员活动范围
const activityRange = [
  { id: "1", value: "区/县" },
  { id: "2", value: "市" }
];
export default {
  filters: {
    // 返回区域类型
    filAreaType(val) {
      return (val = val === "school" ? "学校" : "其他");
    },

    // 返回学校类型
    filroleType(val) {
      if (val === 0) {
        return "系统角色";
      } else if (val === 1) {
        return "管理员角色";
      } else {
        return "其他角色";
      }
    }
  },
  components: {
    Getmap
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    dialogVisible: false,
    // eslint-disable-next-line vue/require-default-prop
    roleType: 0
  },

  data() {
    // 名字检验正则
    var checkName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        if (validateForbiChar(value)) {
          callback(new Error("姓名不能含有^@,&=*'.\"等关键字符"));
        }
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号码"));
      }
      if (value !== "" && validatePhoneNumber(value) === false) {
        callback(new Error("请输入正确格式的手机号"));
      } else {
        callback();
      }
    };
    var checkIdentityCard = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证号"));
      }
      if (value !== "" && validateIdCard(value) === false) {
        callback(new Error("请输入正确格式的身份证号"));
      } else {
        // this.faceInfo.gender = parseInt(value.substr(16, 1)) % 2 === 1? 0 : 1;
        callback();
      }
    };
    var checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validatePassword(value)) {
        callback(new Error("密码为6~16位，包含数字与英文字母以及_-符号"));
      } else {
        callback();
      }
    };
    return {
      show_Photo: "1",
      // 图片预览控制
      userType: userType,
      // 矫正人员类型
      activityRange: activityRange,
      // 矫正人员活动范围
      showMap: false,
      // 控制地图抓取显示
      pwdType: "password",
      userInfo: {
        name: "",
        identityCard: "",
        // 身份证号
        phone: "",
        // 手机号
        userType: "",
        // 人员类型
        activityRange: "",
        // 活动范围
        dw: "",
        cause: "",
        // 备注
        correct: true,
        // 案由
        longitude: "",
        // 经度
        latitude: "",
        // 纬度
        livingArea:'',//居住小区
        remark:'',//备注
      },
      areaList: [],
      roleList: [],
      rules: {
        name: [
          { required: true, validator: checkName, trigger: ["change", "blur"] }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: ["change", "blur"] }
        ],
        identityCard: [
          {
            required: true,
            validator: checkIdentityCard,
            trigger: ["change", "blur"]
          }
        ],
        communityId: [
          {
            required: true,
            message: "请选择预设角色",
            trigger: ["change", "blur"]
          }
        ],
        userType: [
          {
            required: true,
            message: "请选择人员类型",
            trigger: ["change", "blur"]
          }
        ],
        activityRange: [
          {
            required: true,
            message: "请选择人员活动范围",
            trigger: ["change", "blur"]
          }
        ],
        cause: [
          {
            required: true,
            message: "请输入案由",
            trigger: ["change", "blur"]
          }
        ],
        livingArea:[
          {
            required: true,
            message: "请输入居住小区",
            trigger: ["change", "blur"]
          }
        ]
      },
      // 图片上传
      // ---------------------------------------------------------
      imagelist: [], // 上传列表
      isUpload: false,
      isSelectFile: false, // 是否已经选择要上传的文件
      isimg: false,
      mutiZip: {},
      baseUrl: ""
    };
  },

  methods: {
    // 初始化
    __init() {
      this.show_Photo = "1";
      // console.log("初始化中");
    },

    is_yl() {
      this.show_Photo = "1";
    },

    // 点击显示明文密码
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    // 地图使用
    cancelPoint() {
      this.showMap = false;
    },
    // 获取到经纬度地图使用
    getPoint(val) {
      this.showMap = false;
      console.log(val);
      console.log("现在的坐标是");
      if (val) {
        this.userInfo.dw = val.dw;
        this.userInfo.longitude = val.lng;
        this.userInfo.latitude = val.lat;
      }
    },
    // 提交
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
		  if(this.isUpload == false){
			  this.$message.error('请上传人脸照片');
		  }else{
			  this.$refs.upload.submit();
			}
        }else{
			this.$message.error('请正确输入内容');
		}
      });
    },
    // 预览文件
    // handleChange(fileSrc, fileList) {
    //   var _this = this;
    //   _this.mutiZip = fileSrc.raw;
    //   const ary = [];
    //   ary.push(fileSrc);
    //   _this.imagelist = ary;
    //   var event = event || window.event;
    //   if (event.target.files[0]) {
    //     var file = event.target.files[0];
    //     var reader = new FileReader();
    //     // 转base64
    //     reader.onload = function(e) {
    //       _this.baseUrl = e.target.result; // 将图片路径赋值给src
    //       _this.isUpload = true; // 将图片路径赋值给src
    //       _this.isSelectFile = true;
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // },
    // 预览文件
    handleChange(fileSrc, fileList) {
      var _this = this;
      _this.mutiZip = fileSrc.raw;
      const ary = [];
      ary.push(fileSrc);
      _this.imagelist = ary;
      _this.userInfo.picPath2 = ary;
      var event = event || window.event;
      console.log("event出现");
      if (_this.show_Photo == "1") {
        if (event.target.files[0]) {
          var file = event.target.files[0];
          var reader = new FileReader();
          // 转base64
          reader.onload = function(e) {
            _this.baseUrl = e.target.result; // 将图片路径赋值给src
            _this.isUpload = true; // 将图片路径赋值给src
            _this.isSelectFile = true;
          };
          reader.readAsDataURL(file);
        }
      }
    },

    // 上传成功
    handleSuccess(response, imageFile, fileList) {
      console.log(response);
      if (response.state == 100) {
        // this.$message.error(response.message);
		this.$message({
		  message: response.message,
		  type: 'success'
		});
        this.handleReset();
        this.$emit("submitSuccess");
        return false;
      } else {
        this.show_Photo = "0";
        this.isUpload = false;
        this.$message.error(response.message);
        this.handleReset();
        return false;
      }
    },
    // 重置
    handleReset() {
      this.show_Photo = "0";
      this.$refs["addusermodalrefs"].resetFields();
      this.isUpload = false;
      this.isSelectFile = false; // 是否已经选择要上传的文件
      this.isimg = false;
      this.mutiZip = {};
      this.baseUrl = "";
      this.userInfo = {
        name: "",
        identityCard: "",
        cause: "",
        longitude: "",
        latitude: "",
        correct: true
        // url: "",
        // templateName: ""
      };
    },
    // 获取区域列表
    // fetchGetAreaList() {
    //   getAreaList2('', 100)
    //     .then(res => {
    //       console.log('获取可用区域')
    //       console.log(res)
    //       this.areaList = res.data.list
    //     })
    //     .catch(() => {})
    // },

    // 获取角色列表
    fetchGetRoleList() {
      getRoleList2()
        .then(res => {
          console.log(res);
          this.roleList = res.data.List;
        })
        .catch(() => {});
    },

    // 关闭弹窗
    handleClose() {
      this.$refs["addusermodalrefs"].resetFields();
      this.handleReset();
      this.$emit("closeModal");
    }
  }
};
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

.loading-mask {
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
}
</style>
