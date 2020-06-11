<script>
export default {
  name: "count",
  props: {
    count: {
      trpe: Object,
      default: () => {
        return {
          totalNumber: 0,
          correctedNumber: 0,
          out: 0
        };
      }
    }
  },
  data() {
    return {
      nowday: "",
      bodyStyle: {
        // padding:'62px 50px'
        textAlign: "center"
      }
    };
  },
  computed: {},
  mounted() {
    this.getDate();
  },

  methods: {
    getDate() {
      var myDate = new Date();
      //获取当前年
      var year = myDate.getFullYear();
      //获取当前月
      var month = myDate.getMonth() + 1;
      //获取当前日
      var date = myDate.getDate();
      var h = myDate.getHours(); //获取当前小时数(0-23)
      var m = myDate.getMinutes(); //获取当前分钟数(0-59)
      var s = myDate.getSeconds();
      //获取当前时间
      var now =
        year + "年" + this.conver(month) + "月" + this.conver(date) + "日";
      // console.log(now + "时间");
      this.nowday = now;
    },
    conver(s) {
      return s < 10 ? "0" + s : s;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.box-card {
  width: 100%;
  height: 200px;
  // float: left;
}

.num_box {
  cursor: pointer;
  color: #fff;
  /* border: 1px solid; */
  height: 95px;
  width: 80%;
  margin: 0 auto;
  opacity: 1;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.c_c {
  display: flex;
  justify-content: center;
  align-items: center;
}
.r_c {
  display: flex;
  justify-content: right;
  align-items: baseline;
}
</style>

<template>
  <el-card class="box-card" :body-style="bodyStyle">
    <div slot="header" class="r_c">
      <h3 style="color: #666666;margin:0">当月统计</h3>
      <span style="color: rgb(144, 144, 144);font-size: 12px;margin-left: 10px;">数据统计截止时间：{{nowday}}</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div
          class="num_box"
          style="background:linear-gradient(90deg,rgba(67,221,213,1)0%,rgba(14,153,207,1)100%);"
        >
          <div class="c_c">
            <img src="../../../assets/icons/card3.png" style="margin-right:10px" />
            <span class="span1">
              在矫人数：
              <b style="color:#fff">{{count.totalNumber}}</b>
            </span>
          </div>
        </div>
        <!-- <span>在矫人数：</span>
        <span>{{count.totalNumber}}人</span>-->
      </el-col>
      <el-col :span="8">
        <div
          class="num_box"
          style="background:linear-gradient(90deg,rgba(120,82,251,1) 0%,rgba(165,200,253,1)
          100%);"
        >
          <div class="c_c">
            <img src="../../../assets/icons/card1.png" style="margin-right:10px" />
            <span class="span1">
              当月入矫：
              <b style="color:#fff">{{count.correctedNumber}}</b>
            </span>
          </div>
        </div>

        <!-- <span>当日入矫：</span>
        <span>{{count.correctedNumber}}人</span>-->
      </el-col>
      <el-col :span="8">
        <div
          class="num_box"
          style="background:linear-gradient(90deg,rgba(247,210,152,1) 0%,rgba(242,93,108,1) 100%);"
        >
          <div class="c_c">
            <img src="../../../assets/icons/card1.png" style="margin-right:10px" />
            <span class="span1">
              当月解矫：
              <b style="color:#fff">0</b>
            </span>
          </div>
        </div>

        <!-- <span>当日解矫：</span>
        <span>{{count.out}}人</span>-->
      </el-col>
    </el-row>
  </el-card>
</template>