<template>
  <el-dialog
    title="新建用户"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    :roleType="roleType"
    width="35%"
  >
    <el-form
      label-position="left"
      label-width="80px"
      :model="userInfo"
      :rules="rules"
      ref="addusermodalrefs"
    >
      <el-form-item label="角色类型" prop="roleType" v-if="isTypeFive">
        <el-select v-model="userInfo.roleType" placeholder="请选择">
          <el-option
            v-for="item in roleArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区域选择" prop="communityId" v-else>
        <el-select v-model="userInfo.communityId" filterable placeholder="请选择所属区域">
          <el-option
            v-for="(item, index) in communityId"
            :key="index"
            :label="item.communityName"
            :value="item.communityId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userInfo.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" v-model="userInfo.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="userInfo.name" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="userInfo.phone" placeholder="请输入手机号码" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleSubmit('addusermodalrefs')" :loading="isLoding">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAreaList } from "@/api/area";
import { getcommunity } from "@/api/community";
import { getRoleList, getRoleList2 } from "@/api/role";
import { addUser2 } from "@/api/user";
import { validatePassword, validatePhoneNumber } from "@/utils/validate";
export default {
  props: {
    dialogVisible: false,
    roleType: 0
  },
  data() {
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
      isLoding:false,
      roleArr:[{ value:6,label:'司法人员' },{ value:7,label:'协矫人员' }],
      pwdType: "password",
      userInfo: {
        username: "",
        password: "",
        name: "",
        roleType:null,
        communityId: "",
        phone: ""
      },
      communityId: [],
      roleList: [],
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["change", "blur"]
          }
        ],
        roleType: [
          {
            required: true,
            message: "请选择人员类型",
            trigger: ["change", "blur"]
          }
        ],
        password: [
          {
            required: true,
            trigger: ["change", "blur"],
            validator: checkPassword
          }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: ["change", "blur"] }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: ["change", "blur"] }
        ],
        communityId: [
          {
            required: true,
            message: "请选择人员所属司法所",
            trigger: ["change", "blur"]
          }
        ],
      }
    };
  },
  computed:{
    isTypeFive(){
      return this.$store.getters.roleType === 5 ? true : false
    },
  },
  methods: {
    // 初始化
    __init() {
      this.$store.getters.roleType !=5 && this.fetchGetAreaList()
      // this.fetchGetRoleList();
    },

    // 提交
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // return false;
          this.isLoding = true;
          addUser2(this.userInfo)
            .then(res => {
              this.isLoding = false;
              if(res.data.state == 100){
                this.$emit("submitSuccess");
                this.$refs[formName].resetFields();
              }
            })
            .catch(() => {});
        }
      });
    },

    // 获取区域列表
    fetchGetAreaList() {
      console.log("调用");
      getcommunity(100, 1)
        .then(res => {
          this.communityId = res.data.list;
        })
        .catch(() => {});
    },

    // 获取角色列表
    fetchGetRoleList() {
      getRoleList2()
        .then(res => {
          console.log(res);
          this.roleList = res.data.list;
        })
        .catch(() => {});
    },

    // 关闭弹窗
    handleClose() {
      this.$refs["addusermodalrefs"].resetFields();
      this.$emit("closeModal");
    }
  }
};
</script>

<style lang="scss" scoped>
.show-pwd {
  position: absolute;
  right: 14px;
  z-index: 2019;
}
</style>
