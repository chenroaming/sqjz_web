<template>
  <div>
    <el-scrollbar class="scrollbar">
      <div class="select-box">
        <el-button-group>
          <el-button v-for="(item,index) in buttonGroup" :key="index" :class="applyType === item.index ? 'isSelect' : ''" type="primary" plain @click="changeSelect(item.index)">{{ item.label }}</el-button>
        </el-button-group>
      </div>
      <meeting v-if="applyType === 1" :table-data="tableData" :is-loading="isLoading" @getData="getData"/>
      <outgoing v-if="applyType === 2" :table-data="tableData" :is-loading="isLoading" @getData="getData"/>
      <relocation v-if="applyType === 3" :table-data="tableData" :is-loading="isLoading" @getData="getData"/>
      <exemption v-if="applyType === 4 || applyType === 5 " :table-data="tableData" :is-loading="isLoading" :apply-type="applyType" @getData="getData"/>
      <job v-if="applyType === 6" :table-data="tableData" :is-loading="isLoading" @getData="getData"/>
    </el-scrollbar>
    <div style="margin-top: 20px;text-align: right;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="10"
        :total="totalPage"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import meeting from './type/meeting.vue'
import outgoing from './type/outgoing.vue'
import relocation from './type/relocation.vue'
import exemption from './type/exemption.vue'
import job from './type/job.vue'
import { find } from '@/api/application'
export default {
  name: 'ApplicationIndex',
  components: {
    meeting, outgoing, relocation, exemption, job
  },
  data() {
    return {
      isLoading: false,
      currentPage: 1,
      applyType: 1,
      tableData: [],
      totalPage: 1,
      buttonGroup: [{ index: 1, label: '会客申请' }, { index: 2, label: '外出申请' }, { index: 3, label: '迁居申请' }, { index: 4, label: '免集中教育' }, { index: 5, label: '免集体活动' }, { index: 6, label: '求职申请' }]
    }
  },
  computed: {

  },
  mounted() {
    this.getList(this.applyType, 1)
  },
  methods: {
    getData() {
      this.getList(this.applyType, 1)
    },
    getList(applyType, pageNumber) {
      this.isLoading = true
      find(applyType, pageNumber).then(({ data: { state, list, total }}) => {
        this.isLoading = false
        // eslint-disable-next-line eqeqeq
        this.tableData = state == 100 ? list : []
        // eslint-disable-next-line eqeqeq
        this.totalPage = state == 100 ? total : 1
      })
    },
    changeSelect(index) {
      if (this.applyType === index) return
      this.applyType = index
      this.getList(index)
    },
    handleCurrentChange(e) {
      this.getList(this.applyType, e)
      this.currentPage = 1
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $borderColor:#409EFF;
  .select-box {
      width: 50%;
      margin: 20px 0px;
      margin-left: 20px;
      float: left;
  }
  .isSelect {
      background: $borderColor;
      border-color: $borderColor;
      color: #FFF;
  }
  .attendanceTable {
    max-height: calc(100vh - 180px);
    min-height: calc(100vh - 180px);
    overflow-y: auto;
  }
</style>
