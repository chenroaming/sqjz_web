<template>
  <el-dialog
    title="新增人脸信息"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    width="55%"
    top="20px"
    >
    <el-form label-position="left" label-width="120px" :model="faceInfo" :rules="rules" ref="changeFaceForm">
      <el-form-item label="姓名" prop="name" required>
        <el-input v-model="faceInfo.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="faceInfo.phone" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item label="照片" prop="picPath">
        <img :src="faceInfo.url" class="avatar">
      </el-form-item>
      <el-form-item label="身份证号" prop="identityCard">
        <el-input v-model="faceInfo.identityCard" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="faceInfo.gender">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
          <el-radio label="2">未知</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类别" prop="category" required>
        <el-radio-group v-model="faceInfo.category">
          <el-radio label="1">黑名单</el-radio>
          <el-radio label="0">白名单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身份" prop="identity">
        <el-radio-group v-model="faceInfo.identity">
          <el-radio label="0">其他</el-radio>
          <el-radio label="1">学生</el-radio>
          <el-radio label="2">教师</el-radio>
          <el-radio label="3">员工</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="监护人电话1" prop="guardianPhonesOne" v-if="faceInfo.identity == '1'">
        <el-input v-model="faceInfo.guardianPhonesOne" placeholder="请输入监护人电话"></el-input>
        <el-button type="primary" @click="index++" size="mini" v-if="index == 1 && faceInfo.guardianPhonesOne != ''">添加监护人</el-button>
      </el-form-item>
      <el-form-item label="监护人电话2" prop="guardianPhonesTwo" v-if="index >= 2 && faceInfo.identity == '1'">
        <el-input v-model="faceInfo.guardianPhonesTwo" placeholder="请输入监护人电话"></el-input>
        <el-button type="primary" @click="index++" size="mini" v-if="index == 2 && faceInfo.guardianPhonesTwo != ''">添加监护人</el-button>
      </el-form-item>
      <el-form-item label="监护人电话3" prop="guardianPhonesThree" v-if="index >= 3 && faceInfo.identity == '1'">
        <el-input v-model="faceInfo.guardianPhonesThree" placeholder="请输入监护人电话"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit('changeFaceForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateForbiChar, validatePhoneNumber, validateIdCard } from "@/utils/validate";
import { addFace } from '@/api/face';

export default {
  props: {
    dialogVisible: false,
  },
  data () {
    // 名字检验正则
    var checkName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error('请输入姓名'));
      } else {
        if (validateForbiChar(value)) {
         callback(new Error("姓名不能含有^@,&=*'.\"等关键字符"));
        }
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (value !== '' && validatePhoneNumber(value) === false) {
        callback(new Error('请输入正确格式的手机号'));
      } else {
        callback();
      }
    };
    var checkIdentityCard = (rule, value, callback) => {
      if (value !== '' && validateIdCard(value) === false) {
        callback(new Error('请输入正确格式的身份证号'));
      } else {
        // this.faceInfo.gender = parseInt(value.substr(16, 1)) % 2 === 1? 0 : 1;
        callback();
      }
    };
    return {
      index:1,
      faceInfo: {
        faceId: '',
        category: "0",
        name: '',
        picPath: [],
        identityCard: '',
        gender: "2",
        phone: '',
        identity: '',
        guardianPhones:'',
        guardianPhonesOne:'',
        guardianPhonesTwo:'',
        guardianPhonesThree:'',
        url:''
      },
      imageUrl: [
        {url: require('@/assets/icons/defaultuser.jpg'), isUpload: false, isLoading: false},
        {url: require('@/assets/icons/defaultuser.jpg'), isUpload: false, isLoading: false},
        {url: require('@/assets/icons/defaultuser.jpg'), isUpload: false, isLoading: false}
        ],
      rules:{
        name:[
          { validator: checkName, trigger: 'blur' }
        ],
        phone:[
          { validator: checkPhone, trigger: 'blur' }
        ],
        identityCard:[
          { validator: checkIdentityCard, trigger: 'blur' }
        ],
      }
    }
  },

  methods: {
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleDealFaceData();
        } else {
          this.$message({type:'error', message: '请完善数据'});
        }
      });
    },

    // 检查图片返回事件
    handleCheckSucess (res ,index) {
      if(res.state === '100') {
        if (res.picPaths.length === 0) {
          this.$message({type: 'error', message: `图片校验失败: ${res.failureDetail[0].reason}`});
        } else {
          this.$message({type: 'success', message: '图片校验成功'});
          this.imageUrl[index].url = res.picPaths[0];
          this.imageUrl[index].isUpload = true;
        }
      } else {
        this.$message({type:'error', message: res.message})
      }
      this.imageUrl[index].isLoading = false;
    },

    // 处理数据并提交
    handleDealFaceData () {
      let payload = {
        name:this.faceInfo.name,
        phone:this.faceInfo.phone,
        identityCard:this.faceInfo.identityCard,
        gender:this.faceInfo.gender,
        category:this.faceInfo.category,
        identity:this.faceInfo.identity,
        picPath:this.faceInfo.url
      }
      if(this.faceInfo.identity == 1){
        if(this.faceInfo.guardianPhonesOne =='' && this.faceInfo.guardianPhonesTwo =='' && this.faceInfo.guardianPhonesThree ==''){
          this.$message({type: 'error', message: '至少需要填写一位监护人的电话'});
          return;
        }
        let phoneNum = this.faceInfo.guardianPhonesOne;
        if(this.faceInfo.guardianPhonesTwo !=''){
          phoneNum = phoneNum+','+ this.faceInfo.guardianPhonesTwo
        }
        
        if(this.faceInfo.guardianPhonesThree !=''){
          phoneNum = phoneNum+','+ this.faceInfo.guardianPhonesThree
        }
        payload.guardianPhones = phoneNum
      }
      addFace(payload)
      .then(res=>{
        this.handleReset();
        this.$message({type: 'success', message: '提交成功'});
        this.$emit('submitSuccess');
      }).catch(()=>{});
    },

    // 上传之前的钩子函数，显示加载动画
    handleBeforeUpload (file,index) {
      this.imageUrl[index].isLoading = true;
    },

    // 删除
    handleDeleteImage (index) {
      this.imageUrl[index].url = require('@/assets/icons/defaultuser.jpg');
      this.imageUrl[index].isUpload = false;
      this.$message({type: 'success', message: '清除成功'});
    },

    // 关闭
    handleClose () {
      this.handleReset();
      this.$emit("closeModal");
    },

    // 重置
    handleReset () {
      this.faceInfo={
        faceId: '',
        category: "0",
        name: '',
        picPath: [],
        identityCard: '',
        gender: "2",
        phone: '',
        identity: '',
        guardianPhones:'',
        guardianPhonesOne:'',
        guardianPhonesTwo:'',
        guardianPhonesThree:''
      }
      this.index = 1,
      this.$refs["changeFaceForm"].clearValidate();
      this.$refs["changeFaceForm"].resetFields();
      this.imageUrl.forEach((val, index)=>{
        this.imageUrl[index].url = require('@/assets/icons/defaultuser.jpg');
        this.imageUrl[index].isUpload = false;
      });
    },

    // 接收  图片地址
    getFaceUrl(url){
      this.faceInfo.url = url;
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
      border: 0
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
    border-color: #409EFF;
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
    animation: fadeIn .3s linear forwards;
    transform: all .5s ease;
  }

  .loading-mask-circle {
    width: 20px;
    height: 20px;
    background: #409EFF;
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
      background: rgba(0, 0, 0, .5);
      opacity: 1;
    }
  }
</style>


