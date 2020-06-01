<template>
  <div>
    <div class="searchArea">
      <div class="backTo" style="cursor:pointer">
        <el-button
          circle
          size="medium"
          icon="el-icon-arrow-left"
          @click="handleBack"
          style="margin-right:20px"
        ></el-button>
      </div>
      <div class="detailInfo">
        <el-input v-model="searchData" placeholder="请输入人员名称" style="width:200px"></el-input>
        <span class="demonstration">选择开始日期 :</span>
        <el-date-picker
          v-model="selectBegin"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          placeholder="请选择开始日期"
        ></el-date-picker>
        <span class="demonstration" style="margin-left:5px">选择结束日期 :</span>
        <el-date-picker
          v-model="selectEnd"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          placeholder="请选择结束日期"
        ></el-date-picker>
        <!-- <span style="margin-left:5px">考勤任务列表：</span>
        <el-select
          v-model="selectTask"
          multiple
          placeholder="请选择您要统计的考勤任务(可多选)"
          style="width:350px;"
        >
          <el-option
            v-for="item in taskList"
            :key="item.taskId"
            :label="item.taskName"
            :value="item.taskId"
          ></el-option>
        </el-select>-->
        <el-button type="primary" size="medium" @click="handleSearch">搜索啊啊啊</el-button>
        <!-- <el-button type="primary" size="medium" @click="handOut">导出</el-button> -->

        <el-button type="danger" size="medium" circle icon="el-icon-refresh" @click="handleRefresh"></el-button>
      </div>
    </div>
    <h3 class="blockTitle" v-if="peopleList.length >0">点击图片可查看个人详细打卡信息</h3>
    <h3 class="blockTitle" v-if="peopleList.length == 0">暂无个人打卡信息</h3>
    <div class="lookBody">
      <div class="block" v-for="fit in peopleList" :key="fit.faceId" @click="showAct(fit.faceId)">
        <img style="width: 120px; height: 150px" :src="fit.picPath" :fit="fit" />
        <p class="demonstration">{{ fit.name }}</p>
        <p class="demonstration">考勤时长：{{fit.duration}}（分钟）</p>
      </div>
    </div>
    <!-- 个人详细考勤时长记录 -->
    <Activityrecord
      ref="activityRefs"
      :dialogVisible.sync="showModel"
      @closeModal="showModel=false"
    />
  </div>
</template>

<script>
import sortmix from "@/utils/sortmix";
import {
  getCheckList,
  intervalRecordCount,
  personRecordCount,
  checkHavingIntervalRecordOrNot
} from "@/api/attendance";
import Activityrecord from "../activityrecord/activityrecord";

export default {
  mixins: [sortmix],
  components: {
    Activityrecord
  },
  data() {
    return {
      taskList: [], //任务列表
      selectTask: [], //选中的任务
      selectBegin: null, //开始时间
      selectEnd: null, //结束时间，
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      peopleList: [], //考勤成员列表
      showModel: false, //运行记录模态框
      searchData: "" //搜索的人员名称
    };
  },

  mounted() {
    this.getAllTask();
  },

  filters: {},

  methods: {
    // 获取区间考勤任务列表（3 代表为区间考勤）
    getAllTask() {
      console.log(this.$route.query.orderId);
      getCheckList("", 100, 1, 3)
        .then(res => {
          this.taskList = res.data.List;
        })
        .catch(() => {
          this.taskList = [];
        });
    },

    // 返回
    handleBack() {
      this.$router.push({ name: "screen-manger" });
    },

    // 刷新
    handleRefresh() {},

    //搜索（获取区间统计信息）
    handleSearch() {
      if (this.selectBegin == null) {
        this.$message({ type: "error", message: "请先选择任务的开始时间" });
        return;
      }
      if (this.selectEnd == null) {
        this.$message({ type: "error", message: "请先选择任务的结束时间" });
        return;
      }
      if (this.selectTask.length == 0) {
        this.$message({ type: "error", message: "请选择您要统计的考勤任务" });
        return;
      }
      let listStr = this.selectTask.join(",");
      this.peopleList = [];
      intervalRecordCount(
        listStr,
        this.selectBegin,
        this.selectEnd,
        this.searchData
      )
        .then(res => {
          this.$message({ type: "success", message: "考勤任务统计成功" });
          this.peopleList = res.data.List;
        })
        .catch(() => {
          this.peopleList = [];
        });
    },
    //导出区间考勤记录为Excel表格
    handOut() {
      if (this.selectBegin == null) {
        this.$message({ type: "error", message: "请先选择任务的开始时间" });
        return;
      }
      if (this.selectEnd == null) {
        this.$message({ type: "error", message: "请先选择任务的结束时间" });
        return;
      }
      if (this.selectTask.length == 0) {
        this.$message({ type: "error", message: "请选择您要统计的考勤任务" });
        return;
      }
      let oneYear = parseInt(this.selectBegin.split("-")[0]);
      let twoYear = parseInt(this.selectEnd.split("-")[0]);
      let oneMonth = parseInt(this.selectBegin.split("-")[1].split("-")[0]);
      let twoMonth = parseInt(this.selectEnd.split("-")[1].split("-")[0]);
      let startDate = parseInt(this.selectBegin.split("-")[2]);
      let endDate = parseInt(this.selectEnd.split("-")[2]);
      if (this.selectBegin > this.selectEnd) {
        this.$message({ type: "error", message: "开始时间不能大于结束时间" });
        return;
      }
      var startTime = new Date(this.selectBegin.replace("//-/g", "//"));
      var endTime = new Date(this.selectEnd.replace("//-/g", "//"));
      // console.log(parseInt((endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60));
      if (
        parseInt((endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60) >
        744
      ) {
        this.$message({
          type: "error",
          message: "开始时间与结束时间的区间超过一个月"
        });
        return;
      }
      let excelListStr = this.selectTask.join(",");
      this.excelList = [];
      let msgloding = this.$loading({
        lock: true,
        text: "考勤报表报表查询中，请耐心等待...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      checkHavingIntervalRecordOrNot(
        excelListStr,
        this.selectBegin,
        this.selectEnd
      )
        .then(res => {
          this.$message({ type: "success", message: "考勤任务统计成功" });
          this.excelList = res.data;
          let exportId = res.data.exportId;
          msgloding.close();
          window.open(
            "/school_administration/webClass/attendance/exportIntervalRecordToExcel.jhtml?" +
              `exportId=${res.data.exportId}`
          );
        })
        .catch(() => {
          msgloding.close();
          setTimeout(() => {
            msgloding.close();
          }, 30000);
        });
    },
    //点击查看个人信息考勤时长记录
    showAct(val) {
      this.showModel = true;
      let listStr = this.selectTask.join(",");
      this.$refs.activityRefs.getList(
        val,
        listStr,
        this.selectBegin,
        this.selectEnd
      );
    },
    //关闭表格模态框
    closeModel() {
      this.showModel = false;
    }
  }
};
</script>

<style lang='scss' scoped>
.backTo {
  white-space: nowrap;
}

.searchArea {
  width: 98%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: nowrap;
}

.detailInfo {
  width: 95%;
  margin: 10px auto;
  text-align: right;
}

.taskTable {
  min-height: 700px;
  max-height: 700px;
  overflow-y: auto;
}

.image {
  width: 100%;
  height: 340px;
  display: block;
}

.lookBody {
  width: 100%;
  height: 700px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: auto;
}

.block {
  padding: 30px 0;
  width: 180px;
  height: 230px;
  text-align: center;
  font-size: 14px;
  background-color: #f0f0f0;
  border-radius: 3px;
  margin: 20px 20px 10px 20px;
  cursor: pointer;
}

.blockTitle {
  text-align: center;
  color: #d3d3d3;
  background-color: white;
  margin: 0;
  padding: 0;
  padding: 20px 0 20px 0;
}

.demonstration {
  height: 15px;
  line-height: 15px;
  padding: 0;
  margin: 5px;
}
</style>