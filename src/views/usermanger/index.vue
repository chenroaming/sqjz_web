<template>
  <div>
    <Searcharea
      v-model="searchData"
      @handleSearch="__init(searchData, 1)"
      @refreshData="handleRefresh"
    >
      <div slot="extraArea">
        <el-input v-model="searchData" placeholder="请输入用户名称" style="width:200px" />
      </div>
      <div slot="eventArea">
        <el-button
          icon="el-icon-plus"
          style="margin:0 10px 0 10px"
          @click="handleUserCurd('ADD_USER')"
          v-if="checkPermission(['admin:operate'])"
        >新增用户</el-button>
      </div>
    </Searcharea>
    <el-table v-loading="isLoading" :data="tableData" class="userTable" style="width: 100%">
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="username" label="账号" align="center">
        <template slot-scope="scope">
          <span v-if="checkPermission(['admin:operate'])" style="cursor:pointer" @click="handleUserCurd('CHANGE_USER_INFO', scope.row)">
            {{ scope.row.username }}
            <i class="el-icon-edit-outline" />
          </span>
          <span v-else>
            {{ scope.row.username }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="communityName" label="所属区域" align="center"></el-table-column>
      <el-table-column prop="loginIp" label="登录时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.loginDate">{{ scope.row.loginDate | setLastLoginTime }}</span>
          <el-tag v-if="!scope.row.loginDate" type="info">暂无</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isEnabled" label="是否可用" align="center">
        <template slot-scope="scope">
          <el-tag>是</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" v-if="checkPermission(['admin:operate'])" type="warning" @click="handleUserCurd('CHANGE_AUTH', scope.row)">权限配置</el-button>
          <el-button size="small" v-if="checkPermission(['admin:operate'])" type="danger" @click="handleUserCurd('DELETE_USER', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <SortPage
      :sort-show="sortShow"
      :current-page="currentPage"
      :total-pages="sortpagesTotal"
      @sizeChange="sizeChange"
    />
    <ChangeUserModal
      ref="chguserrefs"
      :dialog-visible="userModalVisible"
      @modalClose="userModalVisible=false"
      @submitSuccess="handleUserSuccess('CHANGE_USER_INFO_SUCCESS')"
    />

    <ChangeUserAuth
      ref="UserAuthrefs" :user="roleObj"
    />

    <Adduser
      ref="adduserrefs"
      :dialog-visible="addUserVisible"
      :role-type="roleType"
      @closeModal="addUserVisible=false"
      @submitSuccess="handleUserSuccess('ADD_USER_INFO_SUCCESS')"
    />
  </div>
</template>

<script>
import ChangeUserModal from "./changeuserinfo/changeuserinfo";
import ChangeUserAuth from "./changeuserauth/changeuserauth";
import Adduser from "./adduser/adduser";
import Searcharea from "@/components/searcharea/searcharea";
import SortPage from "@/components/sortpage/sortpage";

import authmix from "@/utils/authmix";
import sortmix from "@/utils/sortmix";

import { getUserList2, deleteUser2 } from "@/api/user";
import { updateInterface } from "@/api/face";
import { computedFormatTime } from "@/utils/tools";
import { mapState } from "vuex";

export default {
  components: {
    ChangeUserModal,
    ChangeUserAuth,
    Searcharea,
    SortPage,
    Adduser
  },

  filters: {
    // 格式化登录时间
    setLastLoginTime(timeObj) {
      if (timeObj === null) return "";
      return computedFormatTime(timeObj.time);
    }
  },
  mixins: [authmix, sortmix],

  data() {
    return {
      sortpagesTotal: 0, // 数据总数量
      currentPages: 1, // 当前页数
      searchData: "", // 搜索框内容
      tableData: [], // 用户表格数据
      userModalVisible: false,
      authDrawerVisible: false,
      addUserVisible: false,
      authInfo: {
        // 权限用户信息
        adminId: 0,
        username: "",
        name: ""
      },
      roleObj:{},
    };
  },

  created() {
    // 获取用户列表
    this.__init();
  },

  computed: {
    ...mapState({
      roleType: state => state.user.roleType
    })
  },

  methods: {
    // 获取用户列表
    __init(username = "", pageNumber = this.pageNumber) {
      getUserList2(username, pageNumber)
        .then(res => {
          console.log(res);
          this.tableData = res.data.list;
          this.pageNumber = res.data.pageNumber;
          this.sortpagesTotal = res.data.total;
          this.$message({ type: "success", message: "获取成功" });
          this.handleResetSort();
        })
        .catch(res => {
          this.tableData = [];
          this.isLoading = false;
        });
    },

    handleUserCurd(modalType, payload = {}) {
      switch (modalType) {
        case "ADD_USER":
          this.$refs.adduserrefs.__init();
          this.addUserVisible = true;
          break;
        // eslint-disable-next-line no-case-declarations
        case "CHANGE_USER_INFO":
          const userInfo = { ...payload };
          this.$refs.chguserrefs.receiveUserInfo(userInfo);
          this.userModalVisible = true;
          break;
        case "DELETE_USER":
          this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              deleteUser2(payload.adminId)
                .then(() => {
                  this.$message({ type: "success", message: "删除成功" });
                  this.__init();
                })
                .catch(() => {});
            })
            .catch(() => {});
          break;
        // eslint-disable-next-line no-case-declarations
        case "CHANGE_AUTH":
          this.roleObj = payload;
          this.$refs.UserAuthrefs.show(payload);
          break;
        default:
          break;
      }
    },

    // 用户CURD事件反馈
    handleUserSuccess(status) {
      switch (status) {
        case "CHANGE_USER_INFO_SUCCESS":
          this.__init();
          this.userModalVisible = false;
          break;
        case "ADD_USER_INFO_SUCCESS":
          this.__init();

          this.addUserVisible = false;
          break;
        default:
          break;
      }
    },

    // 分页切换
    sizeChange(nums) {
      this.pageNumber = nums;
      this.__init(this.searchData, nums);
    },

    // 刷新
    handleRefresh() {
      this.searchData = "";
      this.__init("", 1);
    },

    // 更新算法
    handleFaceCurd() {
      alert("更新算法");
      // updateInterface()
      //   .then(() => {
      //     this.$message({
      //       type: "success",
      //       message: "更新成功"
      //     });
      //   })
      //   .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.userTable {
  max-height: calc(100vh - 180px);
  min-height: calc(100vh - 180px);
  overflow-y: auto;
}
</style>
