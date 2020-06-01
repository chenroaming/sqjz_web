<script>
  import echarts from 'echarts/lib/echarts'
  export default {
    name: "histogram",
    props:{
      countArr:{
        type:Array,
        default:[]
      },
      chartTitle:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        bodyStyle:{
          textAlign: 'center'
        },
        legendData:[],
        seriesData:[],
        xData:[],
      };
    },
    computed: {
      
    },
    watch:{
      countArr(cur,old){
        this.seriesData = cur[0].date ? this.dataFilter2(cur) : cur.map(item => {
          return this.dataFilter1(item)
        });
        this.legendData = cur[0].type ? cur.map(item => {
          const { type } = item
          return type
        }) : ['已完成','未完成'];
        this.xData = cur[0].date ? cur.map(item => {
          const { date } = item
          return date
        }) : [];
        this.chartInit();
      },
    },
    mounted() {
      
    },

    methods: {
      dataFilter1(item){
        const { number,type } = item
        return {
          name:type,
          type:'bar',
          data:[number],
          label: {//图表数值显示
            show: true,
            position: 'top'
          },
        }
      },
      dataFilter2(cur){//每日报告统计数据整理
        const isCompleted = {
          name:'已完成',
          type:'bar',
          label: {
            show: true,
            position: 'top'
          },
          data:cur.map(item => {
            const { complete } = item;
            return complete
          })
        }
        const unCompleted = {
          name:'未完成',
          type:'bar',
          label: {
            show: true,
            position: 'top'
          },
          data:cur.map(item => {
            const { uncompleted } = item
            return uncompleted
          })
        }
        return [isCompleted,unCompleted]
      },
      chartInit(){
        const chartBox = this.$refs.chartBox;
        const myChart = echarts.init(chartBox);
        const option = {
          tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
          },
          legend: {
            data: this.legendData
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.xData
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series:this.seriesData
        };
        myChart.setOption(option);
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .chartBox{
    width: 100%;
    height: 200px;
  }
  .box-card{
    width: 100%;
    height: 300px;
    float: left;
    margin-right: 1%;
    margin-top: 5px;
  }
</style>

<template>
  <div>
    <el-card class="box-card" :body-style="bodyStyle">
      <div slot="header" class="clearfix">
        <span>{{chartTitle}}</span>
      </div>
      <div class="chartBox" ref="chartBox">
      
      </div>
    </el-card>
  </div>
</template>