<template>
  <div>
    <div class="searchArea">
      <div class="backTo" style="cursor:pointer">
        <el-button
          circle
          size="medium"
          icon="el-icon-arrow-left"
          style="margin-right:20px"
          @click="handleBack"
        />
      </div>
      <div class="detailInfo">
        <!-- <el-input v-model="searchData" placeholder="请输入人员名称" style="width:200px"/>
        <span class="demonstration">选择开始日期 :</span>
        <el-date-picker
          v-model="selectBegin"
          :picker-options="pickerOptions"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始日期"
        />
        <span class="demonstration" style="margin-left:5px">选择结束日期 :</span>
        <el-date-picker
          v-model="selectEnd"
          :picker-options="pickerOptions"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束日期"
        />-->
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
        <!-- <el-button type="primary" size="medium" @click="handleSearch">搜索</el-button> -->
        <!-- <el-button type="primary" size="medium" @click="handOut">导出</el-button> -->

        <!-- <el-button
          type="danger"
          size="medium"
          circle
          icon="el-icon-refresh"
          @click="handleRefresh"
        />-->
      </div>
    </div>
    <!-- <h3 class="blockTitle" v-if="peopleList.length >0">点击图片可查看个人详细打卡信息</h3> -->
    <h3 v-if="peopleList.length == 0" class="blockTitle">暂无个人打卡记录</h3>
    <!-- 表格组件 -->
    <el-table :data="peopleList" style="width: 100%" class="snapTable">
      <el-table-column label="打卡照片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.picPath" alt="打卡照片" style="margin-left:20px; height: 170px;" >
        </template>
      </el-table-column>

      <el-table-column label="地点" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.location }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="车主姓名" width="180" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-if="scope.row.name != null">
            <p>姓名: {{ scope.row.name }}</p>
            <p>车牌号码: {{ scope.row.number }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>

          <el-popover
            trigger="hover"
            placement="top"
            v-if="scope.row.name === null"
            style="cursor:pointer"
          >
            <p>姓名: 暂未绑定车主</p>
            <p>车牌号码: {{ scope.row.number }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag type="danger">暂未绑定车主</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>-->

      <el-table-column label="打卡时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 5px">{{ scope.row.clockDate | setLastLoginTime }}</span>
          <!-- <span style="margin-left: 10px">未知</span> -->
        </template>
      </el-table-column>

      <el-table-column label="开始时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 5px">{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 5px">{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">查看详情</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <SortPage
      :sort-show="sortShow"
      :current-page="currentPage"
      :total-pages="sortpagesTotal"
      @sizeChange="sizeChange"
    />
  </div>
</template>

<script>
import sortmix from '@/utils/sortmix'
import {
  getCheckList,
  getCheckList2,
  intervalRecordCount,
  personRecordCount,
  checkHavingIntervalRecordOrNot
} from '@/api/attendance'
import Activityrecord from '../activityrecord/activityrecord'
import SortPage from '@/components/sortpage/sortpage'
import { computedFormatTime } from '@/utils/tools'

export default {
  components: {
    Activityrecord,
    SortPage
  },

  filters: {
    // 格式化登录时间
    setLastLoginTime(timeObj) {
      if (timeObj === null) return ''
      return computedFormatTime(timeObj.time)
    }
  },
  mixins: [sortmix],
  data() {
    return {
      sortpagesTotal: 0, // 数据总数量
      currentPages: 1, // 当前页数

      taskList: [], // 任务列表
      selectTask: [], // 选中的任务
      selectBegin: null, // 开始时间
      selectEnd: null, // 结束时间，
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 // 如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      peopleList: [], // 考勤成员列表
      showModel: false, // 运行记录模态框
      searchData: '' // 搜索的人员名称
    }
  },

  mounted() {
    this.getAllTask()
  },

  methods: {
    // 分页切换
    sizeChange(nums) {
      this.pageNumber = nums
      this.__init(this.searchData, nums)
    },

    // 获取区间考勤任务列表（3 代表为区间考勤）
    getAllTask() {
      // console.log(this.$route.query.orderId);
      if (this.$route.query.orderId != '') {
        // alert(this.$route.query.orderId);
        this.__init()
      }
      // getCheckList("", 100, 1, 3)
      //   .then(res => {
      //     this.taskList = res.data.List;
      //   })
      //   .catch(() => {
      //     this.taskList = [];
      //   });
    },
    __init() {
      getCheckList2(this.$route.query.orderId, this.currentPages)
        .then(res => {
          console.log(res)
          this.peopleList = res.data.list
          this.sortpagesTotal = res.data.total
          this.currentPages = res.data.pageNumber
        })
        .catch(() => {
          this.peopleList = []
        })
    },
    // 返回
    handleBack() {
      // this.$router.push({ name: 'screen-manger' })
      this.$router.go(-1);
    },

    // 刷新
    handleRefresh() {},

    // 搜索（获取区间统计信息）
    handleSearch() {
      if (this.selectBegin == null) {
        this.$message({ type: 'error', message: '请先选择任务的开始时间' })
        return
      }
      if (this.selectEnd == null) {
        this.$message({ type: 'error', message: '请先选择任务的结束时间' })
        return
      }
      if (this.selectTask.length == 0) {
        this.$message({ type: 'error', message: '请选择您要统计的考勤任务' })
        return
      }
      const listStr = this.selectTask.join(',')
      this.peopleList = []
      intervalRecordCount(
        listStr,
        this.selectBegin,
        this.selectEnd,
        this.searchData
      )
        .then(res => {
          this.$message({ type: 'success', message: '考勤任务统计成功' })
          this.peopleList = res.data.List
        })
        .catch(() => {
          this.peopleList = []
        })
    },
    // 导出区间考勤记录为Excel表格
    handOut() {
      if (this.selectBegin == null) {
        this.$message({ type: 'error', message: '请先选择任务的开始时间' })
        return
      }
      if (this.selectEnd == null) {
        this.$message({ type: 'error', message: '请先选择任务的结束时间' })
        return
      }
      if (this.selectTask.length == 0) {
        this.$message({ type: 'error', message: '请选择您要统计的考勤任务' })
        return
      }
      const oneYear = parseInt(this.selectBegin.split('-')[0])
      const twoYear = parseInt(this.selectEnd.split('-')[0])
      const oneMonth = parseInt(this.selectBegin.split('-')[1].split('-')[0])
      const twoMonth = parseInt(this.selectEnd.split('-')[1].split('-')[0])
      const startDate = parseInt(this.selectBegin.split('-')[2])
      const endDate = parseInt(this.selectEnd.split('-')[2])
      if (this.selectBegin > this.selectEnd) {
        this.$message({ type: 'error', message: '开始时间不能大于结束时间' })
        return
      }
      var startTime = new Date(this.selectBegin.replace('//-/g', '//'))
      var endTime = new Date(this.selectEnd.replace('//-/g', '//'))
      // console.log(parseInt((endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60));
      if (
        parseInt((endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60) >
        744
      ) {
        this.$message({
          type: 'error',
          message: '开始时间与结束时间的区间超过一个月'
        })
        return
      }
      const excelListStr = this.selectTask.join(',')
      this.excelList = []
      const msgloding = this.$loading({
        lock: true,
        text: '考勤报表报表查询中，请耐心等待...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      checkHavingIntervalRecordOrNot(
        excelListStr,
        this.selectBegin,
        this.selectEnd
      )
        .then(res => {
          this.$message({ type: 'success', message: '考勤任务统计成功' })
          this.excelList = res.data
          const exportId = res.data.exportId
          msgloding.close()
          window.open(
            '/school_administration/webClass/attendance/exportIntervalRecordToExcel.jhtml?' +
              `exportId=${res.data.exportId}`
          )
        })
        .catch(() => {
          msgloding.close()
          setTimeout(() => {
            msgloding.close()
          }, 30000)
        })
    },
    // 点击查看个人信息考勤时长记录
    showAct(val) {
      this.showModel = true
      const listStr = this.selectTask.join(',')
      this.$refs.activityRefs.getList(
        val,
        listStr,
        this.selectBegin,
        this.selectEnd
      )
    },
    // 关闭表格模态框
    closeModel() {
      this.showModel = false
    }
  }
}
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
.block[data-v-3eefc249] {
  padding: 25px 0;
  width: 165px;
  height: 300px;
  text-align: center;
  font-size: 14px;
  background-color: #f0f0f0;
  border-radius: 3px;
  margin: 20px 20px 10px 20px;
  cursor: pointer;
  float: left;
}
.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}
.userTable {
  max-height: calc(100vh - 180px);
  min-height: calc(100vh - 180px);
  overflow-y: auto;
}
</style>
