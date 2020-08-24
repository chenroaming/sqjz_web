<script>
import { find } from '@/api/reportTask'
import tablemix from '@/utils/tablemix'
import detail from './detail'
import add from './add'
export default {
  name: 'ReportTask',
  components: { detail, add },
  mixins: [tablemix], // 混入文件
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
      reportTaskId: '',
      reportTypeArr: { 1: '位置抽查', 2: '视频抽查' },
      statusArr: { 0: '未开始', 1: '进行中', 2: '已结束' },
      buttonGroup: [
        { label: '全部', value: '' },
        { label: '位置汇报', value: 1 },
        { label: '视频汇报', value: 2 }
      ],
      reportType: '',
      getType: { '系统抽查': 'primary', '位置抽查': 'success', '视频抽查': 'warning' }
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
      const data = {
        pageSize: 10,
        pageNumber: pageNum,
        reportType: this.reportType
      }
      this.isLoading = true
      find(data).then(({ data: { state, list, total }}) => {
        this.tableData = state === '100' ? list.map(item => {
          return {
            ...item,
            startTime: this.exChange(item.createDate.time),
            endTime: this.exChange(item.endDate.time),
            reportTypeText: item.systemTask ? '系统抽查' : this.reportTypeArr[item.reportType],
            status: this.statusArr[item.state]
          }
        }) : []
        this.totalPage = state === '100' ? total : 0
      })
        .finally(() => {
          this.isLoading = false
        })
    },
    showDetail({ reportTaskId }) {
      this.reportTaskId = reportTaskId
      this.isLoading = true
      this.$refs.detail.show()
    },
    handleCurrentChange(e) {
      this.getList(e)
    },
    addTask() {
      this.$refs.add.show()
    },
    changeType(type) {
      if (this.reportType === type) return false
      this.currentPage = 1
      this.reportType = type
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
  @import '@/styles/buttonStyle.scss';
</style>

<template>
  <div class="dashboard-container">
    <el-scrollbar class="scrollbar">
      <div class="select-box">
        <el-button-group>
          <el-button
            v-for="item in buttonGroup"
            :key="item.value"
            :autofocus="true"
            :class="reportType === item.value ? 'isSelect' : ''"
            type="primary"
            plain
            @click="changeType(item.value)">{{ item.label }}</el-button>
        </el-button-group>
      </div>
      <div class="button-box">
        <el-button
          icon="el-icon-plus"
          style="margin:0 10px 0 10px"
          @click="addTask"
        >创建抽查任务</el-button>
      </div>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        :header-cell-style="rowClass"
        class="tableShadow"
        element-loading-text="数据拼命加载中...."
      >
        <el-table-column
          prop="reportTypeText"
          label="汇报类型"
          align="center">
          <template slot-scope="scope">
            <el-tag
              :type="getType[scope.row.reportTypeText]">
              {{ scope.row.reportTypeText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间"
          align="center" />
        <el-table-column
          prop="endTime"
          label="结束时间"
          align="center" />
        <el-table-column
          prop="reportNumber"
          label="已汇报人数"
          align="center" />
        <el-table-column
          prop="totalNumber"
          label="总人数"
          align="center" />
        <el-table-column
          prop="status"
          label="状态"
          align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.state ? 'warning' : 'success'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="showDetail(scope.row)">查看详情</el-button>
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
    <detail
      ref="detail"
      :report-task-id="reportTaskId"
      :is-loading.sync="isLoading"/>
    <add
      ref="add"
      @done="done"/>
  </div>
</template>

