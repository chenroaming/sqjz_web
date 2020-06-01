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
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userInfo.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        <el-input
          v-show="pwdType=== 'password'"
          type="password"
          v-model="userInfo.password"
          name="password"
          placeholder="密码为6~16位，包含数字与英文字母以及 _ - 符号"
        />
        <el-input
          v-show="pwdType=== ''"
          type="text"
          v-model="userInfo.password"
          name="password"
          placeholder="密码为6~16位，包含数字与英文字母以及 _ - 符号"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="userInfo.name" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <!-- <el-form-item label="司法所" prop="communityId" required>
        <el-select v-model="userInfo.communityId" placeholder="请选择所属司法所">
          <el-option
            v-for="(item, index) in communityId"
            :key="index"
            :label="item.communityName"
            :value="item.communityId"
          />
        </el-select>
      </el-form-item> -->

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
      pwdType: "password",
      userInfo: {
        username: "",
        password: "",
        name: "",
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
        areaId: [
          {
            required: true,
            message: "请选择预设区域",
            trigger: ["change", "blur"]
          }
        ],
        roleId: [
          {
            required: true,
            message: "请选择预设角色",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },

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

  methods: {
    // 初始化
    __init() {
      // this.fetchGetAreaList();
      // this.fetchGetRoleList();
    },

    // 点击显示明文密码
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
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

    // // 获取区域列表
    // fetchGetAreaList() {
    //   console.log("调用");
    //   getcommunity(100, 1)
    //     .then(res => {
    //       console.log(res);
    //       this.communityId = res.data.list;
    //     })
    //     .catch(() => {});
    // },

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
