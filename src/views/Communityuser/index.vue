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
import { mapState } from 'vuex'

export default {
  components: {
    Searcharea,
    Adduser,
    trackMap
  },
  mixins: [authmix, sortmix, tablemix],
  data() {
    return {
      options: [],
      showMap: false,
      // 控制地图抓取显示
      sortpagesTotal: 0, // 数据总数量
      currentPage: 1, // 当前页数
      searchData: {
        name: '',
        identityCard: '',
        communityId: '',
        userType: ''
      }, // 搜索框内容
      currentSearchData: {
        name: '',
        identityCard: '',
        communityId: '',
        userType: ''
      }, // 点击搜索时的内容，避免分页时的搜索BUG
      tableData: [], // 用户表格数据
      authDrawerVisible: false,
      addUserVisible: false,
      authInfo: {
        // 权限用户信息
        adminId: 0,
        username: '',
        name: ''
      }
    }
  },
  computed: {
    ...mapState({
      roleType: state => state.user.roleType
    }),
    canChoice() {
      return this.$store.getters.roleType < 5
    }
  },
  watch: {
    currentPage(cur, old) {
      this.$store.dispatch('SetNowPage', cur)
    }
  },
  created() {
    this.$store.getters.roleType < 5 && this.getUsercommunity()// 获取司法所列表,当用户rolyType小于5时才去获取
    this.currentSearchData = this.$store.getters.searchData // 获取当前搜索值
    this.searchData = this.currentSearchData
    this.currentPage = this.$store.getters.nowPage // 当前页必须在created中改变，在mounted中改变无效
    this.__init()
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
        ...this.currentSearchData,
        pageNumber: this.currentPage,
        pageSize: 10
      }
      getCommunityUserList(data)
        .then(({ data: { state, list, pageNumber, total }}) => {
          if (state === '100') {
            this.tableData = list.map(item => {
              return {
                ...item,
                registerTime: this.exChange(item.createDate.time),
                typeText: this.correctType
                  .find(({ value }) => item.userType === value).label
              }
            })
            this.pageNumber = pageNumber
            this.sortpagesTotal = total
            this.handleResetSort()
            return
          }
          this.sortpagesTotal = 0
          this.tableData = []
        })
        .catch(res => {
          this.sortpagesTotal = 0
          this.tableData = []
        })
        .finally(() => { this.isLoading = false })
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
          this.$router.push({ name: 'change-user', params: userInfo })
          break
        case 'DELETE_USER':
          this.$confirm('是否确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              delCorrectionalpersonnel(payload.userId)
                .then(res => {
                  if (res.data.state === '100') {
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
    handleUserSuccess(status) { // 用户CURD事件反馈
      switch (status) {
        case 'CHANGE_USER_INFO_SUCCESS':
          this.__init()
          break
        case 'ADD_USER_INFO_SUCCESS':
          this.__init()
          this.addUserVisible = false
          break
        default:
          break
      }
    },
    sizeChange() { // 分页切换
      this.isLoading = true
      this.__init()
    },
    handleRefresh() { // 刷新
      this.searchData = {
        name: '',
        identityCard: '',
        communityId: '',
        userType: ''
      } // 搜索框内容;
      this.getCurrent()
      this.__init()
    },
    handleSearch() { // 搜索
      this.getCurrent()
      this.__init()
    },
    getCurrent() {
      this.currentPage = 1
      this.currentSearchData = { ...this.searchData }
      this.$store.dispatch('SetSearchData', this.currentSearchData)
    },
    srcList(url) { // 图片放大功能
      return [url]
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

<style lang="scss">
  /* 改变关闭按钮样式 */
  .enlarge {
    .el-icon-circle-close {
      color: #fff;
    }
  }
</style>

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
          <span>监管类别：</span>
          <el-select
            v-model="searchData.userType"
            placeholder="请选择监管类别"
            style="width:150px; margin-right:20px;">
            <el-option
              v-for="item in correctType"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </div>

        <div slot="extraArea">
          <span>人员姓名：</span>
          <el-input
            v-model="searchData.name"
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
            <el-image
              :src="scope.row.picPath"
              :preview-src-list="srcList(scope.row.picPath)"
              class="enlarge"
              style="width: 80px; height: 100px"/>
          </template>
        </el-table-column>

        <el-table-column
          prop="username"
          label="人员姓名"
          align="center"
        >
          <template slot-scope="scope">
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
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeText"
          label="监管类别"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.userType === 1 || scope.row.userType === 2 ? 'primary' : 'danger'">
              {{ scope.row.typeText }}
            </el-tag>
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
          prop="areaName"
          label="矫正状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.correct">在矫</el-tag>
            <el-tag v-if="!scope.row.correct" type="success">解矫</el-tag>
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
            <!-- <el-button
              v-if="checkPermission(['user:operate'])"
              size="mini"
              type="warning"
              @click="handleUserCurd('DELETE_USER', scope.row)"
            >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-pagination
      :current-page.sync="currentPage"
      :page-size="10"
      :total="sortpagesTotal"
      hide-on-single-page
      layout="total, prev, pager, next"
      style="float: right;"
      @current-change="sizeChange"
    />
    <trackMap ref="trackMap"/>
    <Adduser
      ref="adduserrefs"
      :dialog-visible="addUserVisible"
      :role-type="roleType"
      :close-modal.sync="addUserVisible"
      @submitSuccess="handleUserSuccess('ADD_USER_INFO_SUCCESS')"
    />
  </div>
</template>
