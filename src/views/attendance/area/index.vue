<template>
  <div>
    <div>
      <Search
        :search-data="searchData"
        @refreshData="handleRefresh"
        @handleSearch="__init(searchData)"
      >
        <div slot="extraArea">
          <el-input v-model="searchData" placeholder="请输入任务名称" style="width:200px" />
        </div>
        <span slot="eventArea">
          <el-button
            icon="el-icon-plus"
            style="margin:0 10px 0 10px"
            @click="handleCheckCurd('ADD_TASK')"
            v-if="checkPermission(['clock:operate'])"
          >新增报告规则</el-button>
        </span>
      </Search>
    </div>
    <el-table
      v-loading="isLoading"
      :data="tableData"
      class="attendanceTable"
      element-loading-text="数据拼命加载中...."
      height="250px"
      style="width: 100%"
    >
      <el-table-column prop="taskName" label="规则名称" align="center">
        <template slot-scope="scope">
          <span v-if="checkPermission(['clock:operate'])" style="cursor:pointer" @click="changeRules(scope.row)">
            {{ scope.row.ruleName }}
            <i class="el-icon-edit-outline" />
          </span>
          <span v-else>
            {{ scope.row.ruleName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="时间段" align="center">
        <template slot-scope="scope">
          <el-tag
          v-for="(value,index) in scope.row.clockRuleTimes"
          :key="index"
          type="success"
          size="mini"
          style="margin-right:10px"
        >{{ value.startTime }} - {{ value.endTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="attendanceType" label="任务类型" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ruleType == 1" type="info">每日</el-tag>
          <el-tag v-if="scope.row.ruleType == 2" type="warning">每周</el-tag>
          <el-tag v-if="scope.row.ruleType == 3" type="warning">每月</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="taskType" label="任务周期" align="center">
        <template slot-scope="scope">
          <el-tag :type="getPeriodText(scope.row.period) === '每天' ? 'info' : 'warning'">{{getPeriodText(scope.row.period)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="任务操作" align="center" width="220px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleTaskCallBack('FACE_CURD', scope.row)"
          >关联人员</el-button>
          <el-button type="danger" v-if="checkPermission(['clock:operate'])" size="mini" @click="handleCheckCurd('DELETE_TASK', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <rules ref="rules" :rulesObj="rulesObj" @getList="getList"></rules>
    <!-- 人脸库操作 -->
    <Facecurd
      ref="facecurdrefs"
      :auth-drawer-visible="faceCurdModalVisible"
      @closeModal="faceCurdModalVisible=false"
      @faceCurdSuccess="handleTaskCallBack('FACE_CURD_SUCCESS')"
    />

    <Sortpage
      :total-pages="totalPages"
      :sort-show="sortShow"
      :current-page="currentPage"
      @sizeChange="handleSizeChange"
    />
    <Changetask
      ref="changetaskrefs"
      :dialog-visible="chgTaskModalVisible"
      @closeModal="chgTaskModalVisible=false;__init(searchData, 10, num);"
      @submitSuccess="handleTaskCallBack('CHANGE_TASK_SUCCESS')"
    />
    <Addtask
      ref="addtaskrefs"
      :dialog-visible="addTaskModalVisible"
      @closeModal="addTaskModalVisible=false"
      @submitSuccess="handleTaskCallBack('ADD_TASK_SUCCESS')"
    />
    <Looktask
      ref="looktaskrefs"
      :dialog-visible="lookTaskModalVisible"
      @closeModal="lookTaskModalVisible=false"
      @submitSuccess="handleTaskCallBack('LOOK_TASK_SUCCESS')"
    />
    <Exporttask
      ref="exporttaskrefs"
      :dialog-visible="exportTaskModalVisible"
      @closeModal="exportTaskModalVisible=false"
      @submitSuccess="handleTaskCallBack('EXPORT_TASK_SUCCESS')"
    />
  </div>
</template>

<script>
import { geclockList, deleteTask } from "@/api/attendance";
import sortmix from "@/utils/sortmix";
import Facecurd from "./facecurd/facecurd";
// 绑定操作
import Search from "@/components/searcharea/searcharea";
import Sortpage from "@/components/sortpage/sortpage";

import Changetask from "./changetask/changetask";
import Addtask from "./addtask/addtask";
import Looktask from "./looktask/looktask";
import Exporttask from "./exporttask/exporttask";
import rules from '@/components/attendance/rules.vue'
import authmix from "@/utils/authmix";//引入权限校验
export default {
  components: {
    Search,
    Sortpage,
    Changetask,
    Addtask,
    Looktask,
    Exporttask,
    Facecurd,
    rules
  },
  mixins: [authmix,sortmix],//混入文件
  data() {
    return {
      faceCurdModalVisible: false,
      searchData: "",
      totalPages: 0,
      tableData: [],
      chgTaskModalVisible: false,
      addTaskModalVisible: false,
      lookTaskModalVisible: false,
      exportTaskModalVisible: false,
      rulesObj:{},
    };
  },

  mounted() {
    this.__init();
  },

  methods: {
    __init(taskName = "", pageSize = 10, pageNumber = this.pageNumber) {
      this.isLoading = true;
      geclockList(taskName, pageSize, pageNumber)
        .then(res => {
          this.pageNumber = res.data.pageNumber;
          this.tableData = res.data.list;
          this.totalPages = res.data.total;
          this.handleResetSort();
        })
        .catch(() => {
          this.isLoading = false;
          this.tableData = [];
        });
    },
    getList(e){
      this.__init();
    },
    //规则任务名称
    changeRules(item){
      this.rulesObj = item;
      this.$refs.rules.show();
    },
    // 任务操作
    handleCheckCurd(action, payload) {
      switch (action) {
        case "LOOK_COUNT":
          this.$router.push({ name: "area-count", params: {} });
          break;
        case "LOOK_TASK":
          // this.lookTaskModalVisible = true;
          this.$router.push({
            name: "area-detail",
            params: {
              facesetId: "",
              taskId: payload.taskId,
              date: "",
              pageSize: 10,
              pageNumber: 1
            }
          });
          // this.$refs.looktaskrefs.receiveTaskInfo(payload.taskId);
          break;
        case "ADD_TASK":
          this.addTaskModalVisible = true;
          this.$refs.addtaskrefs.receiveTaskInfo();
          break;
        case "EXPORT_TASK":
          this.exportTaskModalVisible = true;
          this.$refs.exporttaskrefs.receiveTaskInfo(payload.taskId);
          break;
        case "CHANGE_TASK":
          this.chgTaskModalVisible = true;
          this.$refs.changetaskrefs.receiveTaskInfo(payload);
          break;
        case "DELETE_TASK":
          this.$confirm("是否确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              deleteTask(payload.ruleId)
                .then(res => {
                  this.$message({ type: "success", message: "删除成功" });
                  this.__init();
                })
                .catch(() => {});
            })
            .catch(() => {});
          break;
        default:
          break;
      }
    },

    // 任务操作反馈
    handleTaskCallBack(action, payload = {}) {
      switch (action) {
        case "CHANGE_TASK_SUCCESS":
          this.__init();
          this.chgTaskModalVisible = false;
          break;
        case "ADD_TASK_SUCCESS":
          this.__init();
          this.addTaskModalVisible = false;
          break;
        case "FACE_CURD":
          this.$refs.facecurdrefs.receiveInfo(payload);
          this.faceCurdModalVisible = true;
          break;

        case "FACE_CURD_SUCCESS":
          this.faceCurdModalVisible = false;
          this.__init();
          break;
        default:
          break;
      }
    },
    //转换日期格式
    getPeriodText(period){
      const week = new Map([
        ['monday','周一'],
        ['tuesday','周二'],
        ['wednesday','周三'],
        ['thursday','周四'],
        ['friday','周五'],
        ['saturday','周六'],
        ['sunday','周日'],
      ])
      return period === 'everyday' ? '每天' : !isNaN(period) ? `每月${period}号` : week.get(period);
    },
    // 刷新
    handleRefresh() {
      this.searchData = "";
      this.__init("", 10, 1);
    },

    // 分页
    handleSizeChange(num) {
      this.pageNumber = num;
      this.__init(this.searchData, 10, num);
    }
  }
};
</script>

<style lang="scss" scoped>
.attendanceTable {
  max-height: calc(100vh - 180px);
  min-height: calc(100vh - 180px);
  overflow-y: auto;
}
</style>

<style>
.el-table--border:after,
.el-table--group:after,
.el-table:before {
  content: "";
  position: absolute;
  background-color: transparent;
  z-index: 1;
}
</style>

