<template>
  <div>
    <Searcharea v-model="searchData" @handleSearch="__init(1)" @refreshData="handleRefresh">
      <div slot="extraArea">
        <el-input
          v-model="searchData.username"
          placeholder="请输入矫正人员姓名"
          style="width:200px; margin-right:20px;"
        />
      </div>

      <div slot="extraArea">
        <el-input v-model="searchData.identityCard" placeholder="请输入身份证号码" style="width:200px" />
      </div>
      <div slot="eventArea">
        <el-button
          icon="el-icon-plus"
          style="margin:0 10px 0 10px"
          @click="handleUserCurd('ADD_USER')"
          v-if="checkPermission(['user:operate'])"
        >新增矫正人员</el-button>
      </div>
    </Searcharea>
    <el-table v-loading="isLoading" :data="tableData" class="userTable" height="500" style="width: 100%">
      <el-table-column prop="areaName" label="人员照片" width="180" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.picPath" alt style="width:80px;height:100px;cursor:pointer;" />
        </template>
      </el-table-column>

      <el-table-column prop="username" label="人员姓名" align="center">
        <template slot-scope="scope">
          <span v-if="checkPermission(['user:operate'])" style="cursor:pointer" @click="handleUserCurd('CHANGE_USER_INFO', scope.row)">
            {{ scope.row.name }}
            <i class="el-icon-edit-outline" />
          </span>
          <span v-else>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="身份证号码" width="180" align="center">
        <template slot-scope="scope">
          <span style="cursor:pointer">
            {{ scope.row.identityCard }}
            <!-- <i class="el-icon-edit-outline"></i> -->
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="居住地址" width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.location != ''" style="cursor:pointer">
            {{ scope.row.location }}
            <!-- <i class="el-icon-edit-outline"></i> -->
          </span>
          <el-tag v-if="scope.row.location == ''" type="info">暂无</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="livingArea" label="居住小区" width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.livingArea != ''" style="cursor:pointer">
            {{ scope.row.livingArea }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="communityName" label="所属机构" width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.communityName != ''" style="cursor:pointer">
            {{ scope.row.communityName }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="矫正类型" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.userType == 1" type="danger">宽管</el-tag>
          <el-tag v-if="scope.row.userType == 2" type="warning">普管</el-tag>
          <el-tag v-if="scope.row.userType == 3" type="warning">严管</el-tag>
          <el-tag v-if="scope.row.userType == 4" type="info">监外执行</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="loginIp" label="入矫时间" width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.createDate">{{ scope.row.createDate | setLastLoginTime }}</span>
          <el-tag v-if="!scope.row.createDate" type="info">暂无</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleUserCurd('CHANGE_AUTH', scope.row)"
          >查看轨迹</el-button>

          <el-button
            size="small"
            type="primary"
            @click="handleUserCurd('LOOK_COUNT', scope.row)"
          >报告记录</el-button>
          <el-button size="small" type="danger" v-if="checkPermission(['user:operate'])" @click="handleUserCurd('DELETE_USER', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <SortPage
      :sort-show="sortShow"
      :current-page="currentPage"
      :total-pages="sortpagesTotal"
      @sizeChange="sizeChange"
    /> -->
    <el-pagination
      @current-change="sizeChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="sortpagesTotal"
      style="float: right;">
    </el-pagination>
    <ChangeUserModal
      ref="chguserrefs"
      :dialog-visible="userModalVisible"
      @modalClose="userModalVisible=false"
      @submitSuccess="handleUserSuccess('CHANGE_USER_INFO_SUCCESS')"
    />
    <!-- <ChangeUserAuth
      ref="authFormrefs"
      :auth-drawer-visible="authDrawerVisible"
      :auth-info="authInfo"
      @closeModal="authDrawerVisible=false"
    /> -->
    <trackMap ref="trackMap"></trackMap>
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
// import ChangeUserAuth from "./changeuserauth/changeuserauth";
import Adduser from "./adduser/adduser";
import Searcharea from "@/components/searcharea/searcharea";
// import SortPage from "@/components/sortpage/sortpage";
import trackMap from "@/components/trackMap/trackMap.vue";
import authmix from "@/utils/authmix";
import sortmix from "@/utils/sortmix";

import { getCommunityUserList, delCorrectionalpersonnel } from "@/api/user";
// eslint-disable-next-line no-unused-vars
import { updateInterface } from "@/api/face";
import { computedFormatTime } from "@/utils/tools";
import { mapState } from "vuex";

export default {
  components: {
    ChangeUserModal,
    // ChangeUserAuth,
    Searcharea,
    // SortPage,
    Adduser,
    trackMap
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
      showMap: false,
      // 控制地图抓取显示
      sortpagesTotal: 0, // 数据总数量
      currentPages: 1, // 当前页数
      searchData: {
        username: "",
        identityCard: ""
      }, // 搜索框内容
      tableData: [], // 用户表格数据
      userModalVisible: false,
      authDrawerVisible: false,
      addUserVisible: false,
      authInfo: {
        // 权限用户信息
        adminId: 0,
        username: "",
        name: ""
      }
    };
  },

  created() {
    // 获取用户列表
    this.__init();
  },

  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapState({
      roleType: state => state.user.roleType
    })
  },

  methods: {
    // 获取用户列表
    __init(pageNumber = this.pageNumber) {
      getCommunityUserList(
        this.searchData.username,
        this.searchData.identityCard,
        pageNumber
      )
        .then(res => {
          this.tableData = res.data.list;
          this.pageNumber = res.data.pageNumber;
          this.sortpagesTotal = res.data.total;
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
          // alert("调用");
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
              // alert("确认");
              // return false;
              delCorrectionalpersonnel(payload.userId)
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
          // const authInfo = {
          //   userId: payload.userId,
          //   // username: payload.username,
          //   name: payload.name
          // };
          // this.$refs.authFormrefs.getUserAuthList(authInfo);
          // this.authDrawerVisible = true;
          const authInfo = {
            userId: payload.userId,
            name: payload.name
          };
          this.$refs.trackMap.show(authInfo);
          break;
        // eslint-disable-next-line no-case-declarations
        case "LOOK_COUNT":
          // alert("打卡");
          const userId = payload.userId;
          this.$router.push({
            name: "area-counts",
            query: { orderId: userId }
          });
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
      this.__init(nums)
    },

    // 刷新
    handleRefresh() {
      this.searchData = "";
      this.__init("", 1);
    },

    // 更新算法
    handleFaceCurd() {
      alert("更新算法");
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}
.userTable {
  max-height: calc(100vh - 180px);
  min-height: calc(100vh - 180px);
  overflow-y: auto;
}
</style>
