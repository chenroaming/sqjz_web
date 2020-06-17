<script>
  import echarts from 'echarts'
  export default {
    name: "pieChart",
    props: {
      countArr: {
        type: Array,
        default: []
      },
      chartTitle: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        bodyStyle: {
          textAlign: "center"
        },
        legendData: [],
        seriesData: []
      };
    },
    computed: {},
    watch: {
      countArr(cur, old) {
        this.legendData = cur.map(item => {
          const { type } = item;
          return type;
        });
        this.seriesData = cur.map(item => {
          return {
            value: item.number,
            name: item.type
          };
        });
        this.chartInit();
      }
    },
    mounted() {},
    methods: {
      chartInit() {
        const chartBox = this.$refs.chartBox;
        const myChart = echarts.init(chartBox);
        const option = {
          // color: ["#ffb422", "#df506b", "#05dbb0"],
          title: {
            // text: '某站点用户访问来源',
            // subtext: '矫正人员类型统计',
            left: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: this.legendData
          },
          series: [
            {
              name: "访问来源",
              type: "pie",
              color: ['#00C1E5', '#68C556', '#9E6D43', '#EBC24C', '#E6557B','#5BDA9A','#7657F8'],
              radius: "55%",
              center: ["50%", "65%"],
              data: this.seriesData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        myChart.setOption(option);
      }
    }
  };
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
</style>

<template>
  <div>
    <el-card class="box-card" :body-style="bodyStyle">
      <div slot="header" class="clearfix">
        <span>{{chartTitle}}</span>
      </div>
      <div class="chartBox" ref="chartBox"></div>
    </el-card>
  </div>
</template>