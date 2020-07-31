<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    title="矫正人员">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="light"
      style="width: 100%"
      height="calc( 100vh - 150px )">
      <el-table-column
        prop="picPath"
        label="照片"
        align="center">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.picPath"
            :preview-src-list="[scope.row.picPath]"
            style="width: 150px;height: 150px;"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center"/>
      <el-table-column
        prop="clockId"
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="5"
        :total="totalPage"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>
  </el-drawer>
</template>

<script>
import { getCommunityUserList } from '@/api/user'
export default {
  name: 'UserTypeCount',
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      searchText: ['ageType', 'communityId', 'sex', 'userType'],
      searchParams: {
        pageSize: 5,
        pageNumber: 1
      }
    }
  },
  watch: {
    drawer(cur, old) {
      !cur && (this.searchParams = {
        pageSize: 5,
        pageNumber: 1
      }) && (this.currentPage = 1)
    }
  },
  mounted() {

  },
  methods: {
    show(obj) {
      const [params] = Object
        .keys(obj) // 取出传入对象的key
        .filter(item => { // 过滤出为真的key及对应的值，性别女为0（也就是假），此处单独处理
          return this.searchText.includes(item) && (obj[item] || obj[item] === 0)
        })
      if (!params) return false // 点击报告统计相关图表不显示
      this.searchParams[params] = obj[params]
      this.getList()
    },
    getList() {
      getCommunityUserList(this.searchParams).then(({ data: { state, list, total }}) => {
        this.tableData = state === '100' ? list : []
        this.totalPage = state === '100' ? total : 0
        this.drawer = true
      })
    },
    showDetail(userInfo) {
      this.$router.push({ name: 'change-user', params: userInfo })
    },
    handleCurrentChange(e) {
      this.searchParams.pageNumber = e
      this.getList()
    }
  }
}
</script>

<style scoped lang = "scss">

</style>
