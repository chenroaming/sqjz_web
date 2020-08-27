<script>
import { findRecordWithoutNoTips, getUsercommunity } from '@/api/user'
import detail from '@/views/Communityuser/changeUser/record/detail.vue'
export default {
  name: 'Record',
  components: {
    detail
  },
  data() {
    return {
      isLoading: false,
      drawer: false,
      direction: 'rtl',
      buttonGroup: [
        { index: '0', label: `已报告`, total: 0 },
        { index: '1', label: `未报告`, total: 0 }
      ],
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      params: {
        date: '', // 日期
        abnormal: '0', // 报告类型
        pageNumber: 1, // 页码
        pageSize: 5 // 每页数目
      },
      communityList: [],
      communityId: ''
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters.roleType < 5
    }
  },
  mounted() {
    getUsercommunity().then(({ data: { list }}) => {
      this.communityList = list
    })
  },
  methods: {
    show() {
      const myDate = new Date()
      this.params.date = `${myDate.getFullYear()}-${myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1}-${myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()}`
      this.getList()
      this.drawer = true
    },
    getList() {
      this.isLoading = true
      findRecordWithoutNoTips(this.params).then(({ data: { state, list, total }}) => {
        this.isLoading = false
        this.getButtonArr(state === '100' ? total : 0)
        state !== '100' && (this.tableData = []) && (this.totalPage = 0)
        state === '100' && (this.tableData = list) && (this.totalPage = total)
      })
    },
    getButtonArr(total1) {
      const data = { // 重新用一个参数对象去请求已报告or未报告的数量
        date: this.params.date, // 日期
        abnormal: this.params.abnormal === '0' ? '1' : '0', // 获取相反的报告数据类型
        pageNumber: 1, // 页码
        pageSize: 5 // 每页数目
      }
      findRecordWithoutNoTips(data).then(({ data: { state, total }}) => {
        if (state === '100') {
          this.buttonGroup[0].total = this.params.abnormal === '0' ? total1 : total
          this.buttonGroup[1].total = this.params.abnormal === '1' ? total1 : total
        } else {
          this.params.abnormal === '1' && (this.buttonGroup[0].total = 0)
          this.params.abnormal === '0' && (this.buttonGroup[1].total = 0)
        }
      })
    },
    changeSelect(index) {
      if (this.params.abnormal === index) return false
      this.params.pageNumber = 1
      this.currentPage = 1
      this.params.abnormal = index
      this.getList(index)
    },
    handleCurrentChange(e) {
      this.params.pageNumber = e
      this.getList()
    },
    showDetail(userInfo) {
      this.$refs.detail.show(userInfo)
    },
    exportList() {
      if (!this.communityId && this.isAdmin) return this.$message.warning('请选择司法所！')
      const link = document.createElement('a') // 生成一个a标签。
      link.href = this.isAdmin
        ? `/community_correction/webClass/clock/export.jhtml?date=${this.params.date}&communityId=${this.communityId}`
        : `/community_correction/webClass/clock/export.jhtml?date=${this.params.date}` // href属性指定下载链接
      link.download = '' // dowload属性指定文件名
      link.click() // click()事件触发下载
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $borderColor:#409EFF;
  .isSelect {
    background: $borderColor;
    border-color: $borderColor;
    color: #FFF;
  }
</style>

<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    title="报告记录">
    <div style="width: 95%;margin: 0 auto;">
      <el-date-picker
        v-model="params.date"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择日期"/>
      <el-button :disabled="isLoading" type="primary" @click="getList">搜索</el-button>
      <el-button v-if="!isAdmin" :disabled="isLoading" type="warning" @click="exportList">导出</el-button>
    </div>
    <div v-if="isAdmin" style="width: 95%;margin:0 auto;margin-top: 5px;">
      <el-select v-model="communityId" style="width:220px" filterable placeholder="请选择司法所">
        <el-option
          v-for="item in communityList"
          :key="item.communityId"
          :label="item.communityName"
          :value="item.communityId"/>
      </el-select>
      <el-button :disabled="isLoading" type="warning" @click="exportList">导出</el-button>
    </div>
    <el-button-group style="margin:3%;">
      <el-button
        v-for="item in buttonGroup"
        :key="item.index"
        :class="params.abnormal === item.index ? 'isSelect' : ''"
        type="primary"
        size="mini"
        plain
        @click="changeSelect(item.index)">{{ item.label }}（{{ item.total }}）</el-button>
    </el-button-group>
    <transition-group name="breadcrumb">
      <el-table
        ref="multipleTable"
        :data="tableData"
        :key="params.abnormal"
        tooltip-effect="light"
        style="width: 100%"
        height="calc( 100vh - 220px )">
        <el-table-column
          prop="picPath"
          label="照片"
          align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.picPath" style="width: 150px;height: 150px;"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"/>
        <el-table-column
          v-if="params.abnormal === '0'"
          prop="clockId"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </transition-group>
    <div style="text-align: center;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="5"
        :total="totalPage"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>
    <detail ref="detail"/>
  </el-drawer>
</template>
