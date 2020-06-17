<template>
  <div class="dashboard-container" ref="main">
    <el-row :gutter="20" style="margin-bottom: 10px;">
      <el-col :span="12">
        <shortcut></shortcut>
      </el-col>
      <el-col :span="12">
        <count :count="chart1.userNumberCount"></count>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 10px;">
      <el-col :span="8">
        <pieChart :countArr="chart1.userTypeCount" chartTitle="矫正人员类型统计"></pieChart>
      </el-col>
      <el-col :span="8">
        <pieChart :countArr="chart1.ageCount" chartTitle="矫正人员年龄统计"></pieChart>
      </el-col>
      <el-col :span="8">
        <pieChart :countArr="chart1.sexCount" chartTitle="矫正人员性别统计"></pieChart>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 10px;">
      <el-col :span="8">
        <pieChart :countArr="chart1.areaCount" chartTitle="矫正人员区域分布统计"></pieChart>
      </el-col>
      <el-col :span="16">
        <histogram :countArr="chart2.applyTypeCount" chartTitle="事务申请统计"></histogram>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <histogram :countArr="chart2.clockCount" chartTitle="近7天每日报告统计"></histogram>
      </el-col>
      <el-col :span="12">
        <histogram :countArr="chart2.warningTypeCount" chartTitle="预警数量统计"></histogram>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { userBasicInfoCount, userActivityInfoCount } from "@/api/chart.js";
import shortcut from "./shortcut/shortcut.vue";
import count from "./count/count.vue";
import pieChart from "./pieChart/pieChart.vue";
import histogram from "./histogram/histogram.vue";
export default {
  name: "Dashboard",
  components: {
    shortcut,
    count,
    pieChart,
    histogram
  },
  data() {
    return {
      chart1: {
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
      }
    };
  },
  computed: {},
  mounted() {
    userBasicInfoCount().then(res => {
      if (res.data.state == 100) {
        this.chart1 = res.data;
      }
    });
    userActivityInfoCount().then(res => {
      if (res.data.state == 100) {
        this.chart2 = res.data;
      }
    });
  },
  methods: {
    listen(e){
      console.log(e)
    }
  }
};
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
