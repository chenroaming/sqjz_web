<script>
import { findRecord } from '@/api/user'
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
      buttonGroup: [{ index: '0', label: '已报告' }, { index: '1', label: '未报告' }],
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      params: {
        date: '', // 日期
        abnormal: '0', // 报告类型
        pageNumber: 1, // 页码
        pageSize: 5 // 每页数目
      }
    }
  },
  methods: {
    show() {
      const myDate = new Date()
      this.params.date = `${myDate.getFullYear()}-${myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1}-${myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()}`
      this.getList(1)
      this.drawer = true
    },
    getList() {
      this.isLoading = true
      findRecord(this.params).then(({ data: { state, list, total }}) => {
        this.isLoading = false
        state !== '100' && (this.tableData = []) && (this.totalPage = 0)
        state === '100' && (this.tableData = list) && (this.totalPage = total)
      })
    },
    changeSelect(index) {
      if (this.params.abnormal === index) return false
      this.params.abnormal = index
      this.params.pageNumber = 1
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(e) {
      this.params.pageNumber = e
      this.getList()
    },
    showDetail(userInfo) {
      this.$refs.detail.show(userInfo)
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
    </div>
    <el-button-group style="margin:3%;">
      <el-button v-for="item in buttonGroup" :key="item.index" :class="params.abnormal === item.index ? 'isSelect' : ''" type="primary" size="mini" plain @click="changeSelect(item.index)">{{ item.label }}</el-button>
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
