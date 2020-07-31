<template>
  <div ref="main" class="dashboard-container">
    <el-row :gutter="20" style="margin-bottom: 10px;">
      <el-col :span="12">
        <shortcut/>
      </el-col>
      <el-col :span="12">
        <count :count="chart1.userNumberCount"/>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 10px;">
      <el-col v-for="item in chartArr" :span="item.span" :key="item.chartTitle">
        <pieChart
          :chart-data="item.chartData"
          :chart-title="item.chartTitle"
          @getUserList="getUserList">
          <!-- 此项目vue版本为2.5，无法使用2.6才有的v-slot -->
          <template v-if="item.isOperating" slot="button">
            <el-button style="float: right; padding: 3px 0" type="text" @click="showDetail">查看详情</el-button>
          </template>
        </pieChart>
      </el-col>
      <el-col v-for="item in chartArr2" :span="item.span" :key="item.chartTitle">
        <histogram :chart-data="item.chartData" :chart-title="item.chartTitle"/>
      </el-col>
    </el-row>
    <record ref="record"/>
    <userTypeCount
      ref="userTypeCount"/>
  </div>
</template>

<script>
import { userBasicInfoCount, userActivityInfoCount } from '@/api/chart.js'
import shortcut from './shortcut/shortcut.vue'
import count from './count/count.vue'
import pieChart from '@/components/charts/pieChart'
import histogram from '@/components/charts/histogram'
import record from './record'
import userTypeCount from './userTypeCount'
export default {
  name: 'Dashboard',
  components: {
    shortcut,
    count,
    pieChart,
    histogram,
    record,
    userTypeCount
  },
  data() {
    return {
      chart1: {
        todayCount: [],
        userTypeCount: [],
        ageCount: [],
        sexCount: [],
        areaCount: [],
        userNumberCount: {}
      },
      chart2: {
        applyTypeCount: [],
        clockCount: [],
        warningTypeCount: []
      },
      chartArr: [],
      chartArr2: []
    }
  },
  computed: {},
  watch: {
    chart1({ todayCount, userTypeCount, ageCount, sexCount, areaCount }, old) { // 饼状图
      this.chartArr = [
        { span: 8, chartData: todayCount, chartTitle: '今日报告统计', isOperating: true },
        { span: 8, chartData: userTypeCount, chartTitle: '矫正对象类型统计' },
        { span: 8, chartData: ageCount, chartTitle: '矫正对象年龄统计' },
        { span: 8, chartData: sexCount, chartTitle: '矫正对象性别统计' },
        { span: 16, chartData: areaCount, chartTitle: '矫正对象区域分布统计' }
      ]
    },
    chart2({ applyTypeCount, clockCount, warningTypeCount }, old) { // 柱状图
      this.chartArr2 = [
        { span: 24, chartData: applyTypeCount, chartTitle: '事务申请统计' },
        { span: 12, chartData: clockCount, chartTitle: '近7天每日报告统计' },
        { span: 12, chartData: warningTypeCount, chartTitle: '预警数量统计' }
      ]
    }
  },
  mounted() {
    userBasicInfoCount().then(({ data }) => {
      const { complete, uncompleted } = data.clockCount // 当日报告单独处理
      const pieData = { ...data }
      pieData.todayCount = [{ type: `已报告-${complete}`, number: complete }, { type: `未报告-${uncompleted}`, number: uncompleted }]
      data.state === '100' && (this.chart1 = pieData)
    })
    userActivityInfoCount().then(({ data }) => {
      data.state === '100' && (this.chart2 = data)
    })
  },
  methods: {
    showDetail() {
      this.$refs.record.show()
    },
    getUserList({ data }) {
      this.$refs.userTypeCount.show(data)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  width: 98%;
  height: 500px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 20px;
}
</style>
