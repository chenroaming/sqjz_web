<script>
import echarts from 'echarts'
export default {
  name: 'PieChart',
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
    legendData() {
      return this.chartData
        .filter(item => item.number) // 过滤为0的数据
        .map(({ type }) => type) // 图表对应项
    },
    seriesData() {
      return this.chartData
        .filter(item => item.number) // 过滤为0的数据
        .map(({ number, type, ageType, communityId, sex, userType }) => { // 图表绘图数据处理
          return {
            value: number,
            name: type,
            ageType, // 年龄类型
            communityId, // 司法所id
            sex, // 性别
            userType // 矫正人员类型
          }
        })
    }
  },
  mounted() {
    this.chartInit()
  },
  methods: {
    chartInit() {
      const chartBox = this.$refs.chartBox
      const myChart = echarts.init(chartBox)
      const option = {
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          // orient: 'vertical',
          left: 'left',
          data: this.legendData
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            color: ['#00C1E5', '#68C556', '#9E6D43', '#EBC24C', '#E6557B', '#5BDA9A', '#7657F8'],
            radius: '55%',
            center: ['50%', '65%'],
            data: this.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
      myChart.on('click', 'series', (e) => {
        this.$emit('getUserList', e)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.chartBox {
  width: 100%;
  height: 200px;
}
.box-card {
  width: 100%;
  height: 300px;
  float: left;
  margin-right: 1%;
  margin-top: 5px;
}
.clearfix span{
  color: #666666;
  font-weight: bold;
}
</style>

<template>
  <el-card :body-style="bodyStyle" class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ chartTitle }}</span>
      <slot name="button"/>
    </div>
    <div ref="chartBox" class="chartBox"/>
  </el-card>
</template>
