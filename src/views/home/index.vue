<template>
  <div ref="main" class="dashboard-container">
    <el-row :gutter="20" style="margin-bottom: 10px;">
      <el-col :span="12">
        <shortcut/>
      </el-col>
      <el-col :span="12">
        <count :count="chart1.userNumberCount" @getMonthCount="getMonthCount"/>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 10px;">
      <el-col v-for="item in chartArr" :span="item.span" :key="item.chartTitle">
        <pieChart
          :chart-data="item.chartData"
          :chart-title="item.chartTitle"
          @getUserList="getUserList">
          <!-- 此项目vue版本为2.5，无法使用2.6才有的v-slot -->
          <!-- <template v-if="item.isOperating" slot="button">
            <el-button style="float: right; padding: 3px 0" type="text" @click="showDetail">查看详情</el-button>
          </template> -->
        </pieChart>
      </el-col>
      <el-col v-for="item in chartArr2" :span="item.span" :key="item.chartTitle">
        <histogram :chart-data="item.chartData" :chart-title="item.chartTitle"/>
      </el-col>
    </el-row>
    <record ref="record"/>
    <userTypeCount
      ref="userTypeCount"
      :form-title="title"/>
    <correctType
      ref="correctType"
      :form-title="title"/>
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
import correctType from './correctType'
export default {
  name: 'Dashboard',
  components: {
    shortcut,
    count,
    pieChart,
    histogram,
    record,
    userTypeCount,
    correctType
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
      chartArr2: [],
      title: ''
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
      this.$store.commit('SET_USERCOUNT', this.chart1.userNumberCount)
    })
    userActivityInfoCount().then(({ data }) => {
      data.state === '100' && (this.chart2 = data)
    })
  },
  methods: {
    showDetail() {
      this.$refs.record.show()
    },
    getUserList({ data, name }) { // 统计图表获取数据
      // 当日报告图表单独处理
      if (name.includes('已报告') || name.includes('未报告')) {
        this.showDetail()
        return true
      }
      // 其他类型的图表统一处理
      const [title] = name.split('-')
      this.title = title
      this.$refs.userTypeCount.show(data)
    },
    getMonthCount(params) { // 当月统计获取数据
      this.title = params.text
      this.$refs.correctType.show(params)
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
