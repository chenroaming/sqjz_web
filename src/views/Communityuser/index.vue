<script>
import Adduser from './adduser/adduser'
import Searcharea from '@/components/searcharea/searcharea'
import trackMap from '@/components/trackMap/trackMap.vue'
import authmix from '@/utils/authmix'
import sortmix from '@/utils/sortmix'
import tablemix from '@/utils/tablemix'
import {
  getCommunityUserList,
  delCorrectionalpersonnel,
  getUsercommunity
} from '@/api/user'
// eslint-disable-next-line no-unused-vars
import { updateInterface } from '@/api/face'
import { computedFormatTime } from '@/utils/tools'
import { mapState } from 'vuex'

export default {
  components: {
    Searcharea,
    Adduser,
    trackMap
  },

  filters: {
    // 格式化登录时间
    setLastLoginTime(timeObj) {
      if (timeObj === null) return ''
      return computedFormatTime(timeObj.time)
    }
  },
  mixins: [authmix, sortmix, tablemix],

  data() {
    return {
      options: [],
      showMap: false,
      // 控制地图抓取显示
      sortpagesTotal: 0, // 数据总数量
      currentPages: 1, // 当前页数
      searchData: {
        username: '',
        identityCard: '',
        communityId: ''
      }, // 搜索框内容
      tableData: [], // 用户表格数据
      // userModalVisible: false,
      authDrawerVisible: false,
      addUserVisible: false,
      authInfo: {
        // 权限用户信息
        adminId: 0,
        username: '',
        name: ''
      },
      blogTitle: 'asdfasfasdfasf'
    }
  },

  created() {
    this.$store.getters.roleType < 5 && this.getUsercommunity()// 获取司法所列表,当用户rolyType小于5时才去获取
    this.__init(this.$store.getters.nowPage)
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
    __init(pageNumber = this.pageNumber) {
      getCommunityUserList(
        this.searchData.username,
        this.searchData.identityCard,
        pageNumber,
        this.searchData.communityId
      )
        .then(({ data: { list, pageNumber, total }}) => {
          this.tableData = list.map(item => {
            return {
              ...item,
              registerTime: this.exChange(item.createDate.time)
            }
          })
          this.pageNumber = pageNumber
          this.sortpagesTotal = total
          this.isLoading = false
          this.handleResetSort()
        })
        .catch(res => {
          this.tableData = []
          this.isLoading = false
        })
    },

    handleUserCurd(modalType, payload = {}) {
      switch (modalType) {
        case 'ADD_USER':
          // alert("调用");
          this.$refs.adduserrefs.__init()
          this.addUserVisible = true
          break
        // eslint-disable-next-line no-case-declarations
        case 'CHANGE_USER_INFO':
          const userInfo = { ...payload }
          this.$router.push({ name: 'change-user', params: userInfo })
          // this.userModalVisible = true;
          break
        case 'DELETE_USER':
          this.$confirm('是否确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              // alert("确认");
              // return false;
              delCorrectionalpersonnel(payload.userId)
                .then(res => {
                  if (res.data.state == 100) {
                    this.__init()
                  }
                })
                .catch(() => {})
            })
            .catch(() => {})
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
          // this.userModalVisible = false;
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
      this.$store.dispatch('SetNowPage', nums)
      this.isLoading = true
      this.__init(nums)
    },

    // 刷新
    handleRefresh() {
      this.searchData = {
        username: '',
        identityCard: ''
      } // 搜索框内容;
      this.__init('', 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}
</style>

<template>
  <div>
    <el-scrollbar class="scrollbar">
      <Searcharea
        v-model="searchData"
        @handleSearch="__init(1)"
        @refreshData="handleRefresh"
      >
        <div v-if="canChoice" slot="extraArea">
          <span>请选择司法所：</span>
          <el-select
            v-model="searchData.communityId"
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
          <span>人员姓名：</span>
          <el-input
            v-model="searchData.username"
            placeholder="请输入矫正对象姓名"
            style="width:150px; margin-right:20px;"
          />
        </div>

        <div slot="extraArea">
          <span>人员身份证：</span>
          <el-input
            v-model="searchData.identityCard"
            placeholder="请输入身份证号码"
            style="width:150px"
          />
          <el-button
            v-if="checkPermission(['user:operate'])"
            icon="el-icon-plus"
            style="margin:0 10px 0 10px"
            @click="handleUserCurd('ADD_USER')"
          >新增矫正对象</el-button
          >
        </div>
      </Searcharea>

      <el-table
        v-loading="isLoading"
        :header-cell-style="rowClass"
        :data="tableData"
        class="tableShadow"
      >
        <el-table-column
          prop="areaName"
          label="人员照片"
          align="center"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.picPath"
              alt
              style="width:80px;height:100px;"
            >
          </template>
        </el-table-column>

        <el-table-column
          prop="username"
          label="人员姓名"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <span v-if="checkPermission(['user:operate'])" style="cursor:pointer" @click="handleUserCurd('CHANGE_USER_INFO', scope.row)">
              {{ scope.row.name }}
              <i class="el-icon-edit-outline" />
            </span> -->
            <span>
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="身份证号码"
          align="center"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.identityCard }}
              <!-- <i class="el-icon-edit-outline"></i> -->
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="居住地址" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.location != ''">
              {{ scope.row.location }}
              <!-- <i class="el-icon-edit-outline"></i> -->
            </span>
            <el-tag v-if="scope.row.location == ''" type="info">暂无</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="livingArea"
          label="居住小区"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.livingArea != ''">
              {{ scope.row.livingArea }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="communityName"
          label="所属机构"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.communityName != ''">
              {{ scope.row.communityName }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="registerTime"
          label="登记时间"
          align="center"
        />

        <el-table-column align="center" width="200" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleUserCurd('CHANGE_USER_INFO', scope.row)"
            >查看详情</el-button
            >
            <el-button
              v-if="checkPermission(['user:operate'])"
              size="mini"
              type="warning"
              @click="handleUserCurd('DELETE_USER', scope.row)"
            >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-pagination
      :current-page.sync="currentPage"
      :page-size="10"
      :total="sortpagesTotal"
      layout="total, prev, pager, next"
      style="float: right;"
      @current-change="sizeChange"
    />
    <trackMap ref="trackMap"/>
    <Adduser
      ref="adduserrefs"
      :dialog-visible="addUserVisible"
      :role-type="roleType"
      @closeModal="addUserVisible = false"
      @submitSuccess="handleUserSuccess('ADD_USER_INFO_SUCCESS')"
    />
  </div>
</template>
