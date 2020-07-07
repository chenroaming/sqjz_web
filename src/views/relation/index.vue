<script>
import relationShip from './relationShip'
import Search from '@/components/searcharea/searcharea'
import { getUserList2 } from '@/api/user'
import authmix from '@/utils/authmix'// 引入权限校验
import tablemix from '@/utils/tablemix'
export default {
  name: 'Relation',
  components: { relationShip, Search },
  mixins: [authmix, tablemix], // 混入文件
  props: {

  },
  data() {
    return {
      userName: '',
      isLoading: false,
      drawer: false,
      tableData: [],
      currentPage: 1,
      totalPage: 1,
      userInfos: {
        adminId: '',
        userInfos: []
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    done() {
      this.getList(this.currentPage)
    },
    getList(pageNum = 1) {
      getUserList2(this.userName, pageNum).then(({ data: { state, list, total }}) => {
        // eslint-disable-next-line eqeqeq
        this.tableData = state == 100 ? list.map(item => {
          return {
            ...item,
            roleText: this.roleArr[item.roleType - 1],
            quantity: item.userInfos.length
          }
        }) : []
        // eslint-disable-next-line eqeqeq
        this.totalPage = state == 100 ? total : 0
      })
    },
    showRelation({ adminId }) {
      this.userInfos = { adminId }
      this.$refs.relationShip.show()
    },
    handleCurrentChange(e) {
      this.getList(e)
    },
    refreshData() {
      this.userName = ''
      this.getList()
    }
  }
}
</script>

<template>
  <div class="dashboard-container">
    <Search
      v-model="userName"
      @handleSearch="getList(1)"
      @refreshData="refreshData"
    >
      <div slot="extraArea">
        <span>请输入姓名：</span>
        <el-input
          v-model="userName"
          placeholder="请输入姓名"
          style="width:150px; margin-right:20px;"
        />
      </div>
    </Search>
    <el-scrollbar class="scrollbar">
      <el-table
        v-loading="isLoading"
        :data="tableData"
        :header-cell-style="rowClass"
        class="tableShadow"
        element-loading-text="数据拼命加载中...."
      >
        <el-table-column
          prop="name"
          label="姓名"
          align="center" />
        <el-table-column
          prop="username"
          label="账号"
          align="center" />
        <el-table-column
          prop="roleText"
          label="角色名称"
          align="center" />
        <el-table-column
          prop="communityName"
          label="所属机构"
          align="center" />
        <el-table-column
          prop="quantity"
          label="已关联人数"
          align="center" />
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button v-if="checkPermission(['user:operate'])" type="primary" size="mini" @click="showRelation(scope.row)">关联人员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <div style="margin-top: 20px;text-align: right;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="10"
        :total="totalPage"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>
    <relationShip ref="relationShip" :user-infos="userInfos" :drawer="drawer" @done="done"/>
  </div>
</template>
