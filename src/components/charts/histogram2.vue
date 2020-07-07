<script>
import echarts from 'echarts'
export default {
  name: 'Histogram',
  props: {
    chartData: {
      type: Array,
      default: () => []
    },
    chartTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bodyStyle: {
        textAlign: 'center'
      }
    }
  },
  computed: {
    seriesData() {
      return this.chartData.length > 0 && this.chartData[0].date ? this.dataFilter2(this.chartData) : this.chartData.map(item => {
        return this.dataFilter1(item)
      })
    },
    legendData() {
      return this.chartData.length > 0 && this.chartData[0].type ? this.chartData.map(({ type }) => {
        return type
      }) : ['已完成', '未完成']
    },
    xData() {
      return this.chartData.length > 0 && this.chartData[0].date ? this.chartData.map(({ date }) => {
        return date
      }) : []
    }
  },
  mounted() {
    this.chartInit()
  },
  methods: {
    dataFilter1({ number, type }) {
      return {
        name: type,
        type: 'bar',
        data: [number],
        label: {// 图表数值显示
          show: true,
          position: 'right'
        }
      }
    },
    dataFilter2(cur) { // 每日报告统计数据整理
      const isCompleted = {
        name: '已完成',
        type: 'bar',
        label: {
          show: true,
          position: 'top'
        },
        data: cur.map(({ complete }) => {
          return complete
        })
      }
      const unCompleted = {
        name: '未完成',
        type: 'bar',
        label: {
          show: true,
          position: 'top'
        },
        data: cur.map(({ uncompleted }) => {
          return uncompleted
        })
      }
      return [isCompleted, unCompleted]
    },
    chartInit() {
      const chartBox = this.$refs.chartBox
      const myChart = echarts.init(chartBox)
      const option = {
        color: ['#00C1E5', '#68C556', '#9E6D43', '#EBC24C', '#E6557B', '#5BDA9A', '#7657F8'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: this.legendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: this.xData
          }
        ],
        series: this.seriesData
      }
      myChart.setOption(option)
    }
  }
}
</script>

  <style rel="stylesheet/scss" lang="scss" scoped>
    .chartBox{
      width: 100%;
      height: 330px;
    }
    .box-card{
      margin: 0 auto;
      width: 95%;
      margin-top: 10px;
    }
    .clearfix span{
    color: #666666;
    font-weight: bold;
  }
  </style>

<template>
  <div>
    <el-card :body-style="bodyStyle" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ chartTitle }}</span>
      </div>
      <div ref="chartBox" class="chartBox"/>
    </el-card>
  </div>
</template>

