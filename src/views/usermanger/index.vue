<template>
  <div>
    <el-scrollbar class="scrollbar">
      <Searcharea
        v-model="searchData"
        @handleSearch="handleSearch"
        @refreshData="handleRefresh"
      >
        <div v-if="canChoice" slot="extraArea">
          <span>请选择司法所：</span>
          <el-select
            v-model="searchData1.communityId"
            clearable
            placeholder="请选择司法所"
            style="width:150px;margin-right:10px"
          >
            <el-option
              v-for="item in options"
              :key="item.communityId"
              :label="item.communityName"
              :value="item.communityId"
            />
          </el-select>
        </div>
        <div slot="extraArea">
          <el-button
            v-permission="['admin:operate']"
            icon="el-icon-plus"
            style="margin:0 10px 0 10px"
            @click="handleUserCurd('ADD_USER')"
          >新增用户</el-button>
          <el-input v-model="searchData" placeholder="请输入用户名称" style="width:200px" />
        </div>
      </Searcharea>
      <el-table v-loading="isLoading" :data="tableData" :header-cell-style="rowClass" class="tableShadow">
        <el-table-column prop="name" label="照片" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.picPath" style="width: 80px;height:100px;line-height: 105px;">
              <div slot="error">
                <span>暂无图片</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
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
        <el-table-column prop="roleName" label="角色名称" align="center"/>
        <el-table-column prop="communityName" label="所属区域" align="center"/>
        <el-table-column prop="loginIp" label="登录时间" align="center" width="180">
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
            <el-button size="small" type="primary" @click="handleUserCurd('SHOW_FACEINFO', scope.row)">人脸识别记录</el-button>
            <el-button v-permission="['admin:operate']" size="small" type="warning" @click="handleUserCurd('CHANGE_AUTH', scope.row)">权限配置</el-button>
            <el-button v-permission="['admin:operate']" size="small" type="danger" @click="handleUserCurd('DELETE_USER', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

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
      ref="UserAuthrefs"
      :user="roleObj"
    />

    <Adduser
      ref="adduserrefs"
      :dialog-visible="addUserVisible"
      :role-type="roleType"
      @closeModal="addUserVisible=false"
      @submitSuccess="handleUserSuccess('ADD_USER_INFO_SUCCESS')"
    />
    <faceInfo
      ref="faceInfo"
      :user-id="roleObj.adminId"
      type="admin"/>
  </div>
</template>

<script>
import ChangeUserModal from './changeuserinfo/changeuserinfo'
import ChangeUserAuth from './changeuserauth/changeuserauth'
import Adduser from './adduser/adduser'
import Searcharea from '@/components/searcharea/searcharea'
import SortPage from '@/components/sortpage/sortpage'

import authmix from '@/utils/authmix'
import sortmix from '@/utils/sortmix'
import faceInfo from '@/views/Communityuser/changeUser/record/faceInfo'
import { getUserList2, deleteUser2, getUsercommunity } from '@/api/user'
import { computedFormatTime } from '@/utils/tools'
import { mapState } from 'vuex'

export default {
  components: {
    ChangeUserModal,
    ChangeUserAuth,
    Searcharea,
    SortPage,
    Adduser,
    faceInfo
  },

  filters: {
    // 格式化登录时间
    setLastLoginTime(timeObj) {
      if (timeObj === null) return ''
      return computedFormatTime(timeObj.time)
    }
  },
  mixins: [authmix, sortmix],

  data() {
    return {
      options: [],
      sortpagesTotal: 0, // 数据总数量
      currentPages: 1, // 当前页数
      searchData: '', // 搜索框内容
      tableData: [], // 用户表格数据
      userModalVisible: false,
      authDrawerVisible: false,
      addUserVisible: false,
      authInfo: {
        // 权限用户信息
        adminId: 0,
        username: '',
        name: ''
      },
      roleObj: {
        adminId: ''
      },
      userName: '',
      communityId: '',
      searchData1: {
        name: '',
        communityId: ''
      }
    }
  },

  created() {
    this.$store.getters.roleType < 5 && this.getUsercommunity()// 获取司法所列表,当用户rolyType小于5时才去获取
    // 获取用户列表
    this.__init()
  },

  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapState({
      roleType: state => state.user.roleType
    }),
    canChoice() {
      return this.$store.getters.roleType < 5
    }
  },

  methods: {
    // 获取可查看司法所
    getUsercommunity() {
      getUsercommunity()
        .then(res => {
          this.options = res.data.list
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.options = []
          this.searchData.communityId = ''
        })
    },
    // 获取用户列表
    __init() {
      const data = {
        ...this.searchData1,
        pageNumber: this.pageNumber
      }
      getUserList2(data)
        .then(({ data: { list, pageNumber, total }}) => {
          this.tableData = list.map(item => {
            return {
              ...item,
              roleName: this.roleNameArr[item.roleType]
            }
          })
          this.pageNumber = pageNumber
          this.sortpagesTotal = total
          this.handleResetSort()
        })
        .catch(res => {
          this.tableData = []
          this.sortpagesTotal = 0
          this.isLoading = false
        })
    },
    handleSearch() {
      this.pageNumber = 1
      this.searchData1.name = this.searchData
      this.__init()
    },
    handleUserCurd(modalType, payload = {}) {
      switch (modalType) {
        case 'ADD_USER':
          this.$refs.adduserrefs.__init()
          this.addUserVisible = true
          break
        // eslint-disable-next-line no-case-declarations
        case 'CHANGE_USER_INFO':
          const userInfo = { ...payload }
          this.$refs.chguserrefs.receiveUserInfo(userInfo)
          this.userModalVisible = true
          break
        case 'DELETE_USER':
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              deleteUser2(payload.adminId)
                .then(() => {
                  this.$message({ type: 'success', message: '删除成功' })
                  this.__init()
                })
                .catch(() => {})
            })
            .catch(() => {})
          break
        // eslint-disable-next-line no-case-declarations
        case 'CHANGE_AUTH':
          this.roleObj = payload
          this.$refs.UserAuthrefs.show(payload)
          break
        case 'SHOW_FACEINFO':
          this.roleObj = payload
          this.$refs.faceInfo.show()
          break
        default:
          break
      }
    },

    // 用户CURD事件反馈
    handleUserSuccess(status) {
      switch (status) {
        case 'CHANGE_USER_INFO_SUCCESS':
          this.__init()
          this.userModalVisible = false
          break
        case 'ADD_USER_INFO_SUCCESS':
          this.__init()
          this.addUserVisible = false
          break
        default:
          break
      }
    },

    // 分页切换
    sizeChange(nums) {
      this.pageNumber = nums
      this.__init()
    },

    // 刷新
    handleRefresh() {
      this.searchData1 = {
        name: '',
        communityId: ''
      }
      this.searchData = ''
      this.pageNumber = 1
      this.__init()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
