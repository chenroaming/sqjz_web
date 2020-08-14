<script>
import { writtenReportInfo } from '@/api/user'
import tablemix from '@/utils/tablemix'
import cardItem from './cardItem'
export default {
  name: 'Wrinfo',
  components: {
    cardItem
  },
  mixins: [tablemix],
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      drawer: false,
      reverse: false,
      activities: [],
      currentPage: 1,
      totalPage: 0,
      centerDialogVisible: false,
      report: {
        reportContent: '',
        filePath: '',
        signaturePicPath: '',
        date2: ''
      }
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.getList()
    },
    getList(pageNumber = 1) {
      const data = {
        userId: this.userId,
        pageNumber: pageNumber,
        pageSize: 5
      }
      writtenReportInfo(data).then(({ data: { state, list, total }}) => {
        this.$emit('update:done', '')
        if (state === '100') {
          this.activities = list.map(item => {
            return {
              ...item,
              date2: this.exChange(item.createDate.time),
              color: '#409EFF'
            }
          })
          this.totalPage = total
          this.drawer = true
          return
        }
        this.activities = []
        this.totalPage = 0
      })
    },
    showDetail(activity) {
      this.report = activity
      this.centerDialogVisible = true
    },
    handleCurrentChange(e) {
      this.getList(e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 15px;
  }
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>

<template>
  <el-drawer
    :visible.sync="drawer"
    title="书面报告">
    <div style="height: calc(100vh - 115px);overflow: auto;">
      <el-timeline :reverse="reverse">
        <transition-group name="el-fade-in">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="activity.date2"
            :timestamp="activity.date2"
            :color="activity.color">
            <cardItem :report="activity" @showDetail="showDetail"/>
          </el-timeline-item>
        </transition-group>
      </el-timeline>
    </div>
    <div style="text-align: center;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="5"
        :total="totalPage"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="社区思想矫正报告"
      width="50%"
      append-to-body
      center>
      <el-row>
        <el-col :span="4">报告内容：</el-col>
        <el-col :span="20">{{ report.reportContent }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">正文录音：</el-col>
        <el-col :span="20">
          <audio :src="report.filePath" controls>
            您的浏览器不支持 audio 标签。
          </audio>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">报告人签名：</el-col>
        <el-col :span="20">
          <el-image :src="report.signaturePicPath" style="width: 150px;height: 150px;"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">被告时间：</el-col>
        <el-col :span="20">{{ report.date2 }}</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </el-drawer>
</template>
