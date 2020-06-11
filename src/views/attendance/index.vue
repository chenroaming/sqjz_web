<template>
  <div>
    <div style="overflow: auto;height: calc( 100vh - 115px )">
      <Search
        :search-data="searchData"
        @refreshData="handleRefresh"
        @handleSearch="__init(searchData)"
      >
        <div slot="extraArea">
          <el-input v-model="searchData" placeholder="请输入考勤名称" style="width:200px" />
        </div>
        <span slot="eventArea">
          <el-button
            icon="el-icon-plus"
            style="margin:0 10px 0 10px"
            @click="handleCheckCurd('ADD_TASK')"
          >新增考勤任务</el-button>
        </span>
      </Search>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        class="tableShadow"
        element-loading-text="数据拼命加载中...."
        height="250px"
        style="width: 100%"
      >
        <el-table-column prop="taskName" label="任务名称" align="center">
          <template slot-scope="scope">
            <span style="cursor:pointer" @click="handleCheckCurd('CHANGE_TASK', scope.row)">
              {{ scope.row.taskName }}
              <i class="el-icon-edit-outline" />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center" />
        <el-table-column prop="endTime" label="结束时间" align="center" />
        <el-table-column prop="attendanceType" label="任务类型" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.attendanceType == 0" type="info">其它</el-tag>
            <el-tag v-if="scope.row.attendanceType == 1" type="warning">上班</el-tag>
            <el-tag v-if="scope.row.attendanceType == 2" type="warning">下班</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="facesetNames" label="考勤人脸库">
          <template slot-scope="scope">
            <div v-if="scope.row.webcamFaceset[0].facesetInfos.length>0">
              <el-tag
                v-for="(value, key) in scope.row.webcamFaceset[0].facesetInfos.slice(0,2)"
                :key="value.facesetId"
                type="success"
                size="mini"
                style="margin-right:10px"
              >{{ value.facesetName }}</el-tag>
              <el-badge
                v-if="scope.row.webcamFaceset[0].facesetInfos.length > 2"
                size="mini"
                type="success"
                style="margin-top:10px"
                value="2+"
              />
            </div>
            <div v-else>
              <el-tag type="info" size="mini" style="margin-right:10px">暂未选择</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="webcamNames" label="考勤摄像头" align="left">
          <template slot-scope="scope">
            <div v-if="scope.row.webcamFaceset[0].webcamInfos.length>0">
              <el-tag
                v-for="item in scope.row.webcamFaceset[0].webcamInfos.slice(0,2)"
                :key="item.webcamId"
                size="mini"
                style="margin-right:10px"
              >{{ item.webcamName }}</el-tag>
              <el-badge
                v-if="scope.row.webcamFaceset[0].webcamInfos.length > 2"
                size="mini"
                type="primary"
                style="margin-top:10px"
                value="2+"
              />
            </div>
            <div v-else>
              <el-tag type="info" size="mini" style="margin-right:10px">暂未选择</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="任务操作" align="center" width="220px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleCheckCurd('LOOK_TASK', scope.row)">详情</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handleCheckCurd('EXPORT_TASK', scope.row)"
            >导出</el-button>
            <el-button type="danger" size="mini" @click="handleCheckCurd('DELETE_TASK', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
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
import { getCheckList, deleteTask } from '@/api/attendance'
import sortmix from '@/utils/sortmix'

import Search from '@/components/searcharea/searcharea'
import Sortpage from '@/components/sortpage/sortpage'

import Changetask from './changetask/changetask'
import Addtask from './addtask/addtask'
import Looktask from './looktask/looktask'
import Exporttask from './exporttask/exporttask'

export default {
  components: {
    Search,
    Sortpage,
    Changetask,
    Addtask,
    Looktask,
    Exporttask
  },
  mixins: [sortmix],
  data() {
    return {
      searchData: '',
      totalPages: 0,
      tableData: [],
      chgTaskModalVisible: false,
      addTaskModalVisible: false,
      lookTaskModalVisible: false,
      exportTaskModalVisible: false
    }
  },

  mounted() {
    this.__init()
  },

  methods: {
    __init(taskName = '', pageSize = 10, pageNumber = this.pageNumber) {
      this.isLoading = true
      getCheckList(taskName, pageSize, pageNumber)
        .then(res => {
          this.pageNumber = res.data.pageNumber
          this.tableData = res.data.List
          this.totalPages = res.data.total
          this.$message({ type: 'success', message: '获取成功' })
          this.handleResetSort()
        })
        .catch(() => {
          this.isLoading = false
          this.tableData = []
        })
    },

    // 任务操作
    handleCheckCurd(action, payload) {
      switch (action) {
        case 'LOOK_TASK':
          // this.lookTaskModalVisible = true;
          this.$router.push({
            name: 'attendance-detail',
            params: {
              facesetId: '',
              taskId: payload.taskId,
              date: '',
              pageSize: 10,
              pageNumber: 1
            }
          })
          // this.$refs.looktaskrefs.receiveTaskInfo(payload.taskId);
          break
        case 'ADD_TASK':
          this.addTaskModalVisible = true
          this.$refs.addtaskrefs.receiveTaskInfo()
          break
        case 'EXPORT_TASK':
          this.exportTaskModalVisible = true
          this.$refs.exporttaskrefs.receiveTaskInfo(payload.taskId)
          break
        case 'CHANGE_TASK':
          this.chgTaskModalVisible = true
          this.$refs.changetaskrefs.receiveTaskInfo(payload)
          break
        case 'DELETE_TASK':
          this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              deleteTask(payload.taskId)
                .then(res => {
                  this.$message({ type: 'success', message: '删除成功' })
                  this.__init()
                })
                .catch(() => {})
            })
            .catch(() => {})
          break
        default:
          break
      }
    },

    // 任务操作反馈
    handleTaskCallBack(action) {
      switch (action) {
        case 'CHANGE_TASK_SUCCESS':
          this.__init()
          this.chgTaskModalVisible = false
          break
        case 'ADD_TASK_SUCCESS':
          this.__init()
          this.addTaskModalVisible = false
          break
        default:
          break
      }
    },

    // 刷新
    handleRefresh() {
      this.searchData = ''
      this.__init('', 10, 1)
    },

    // 分页
    handleSizeChange(num) {
      this.pageNumber = num
      this.__init(this.searchData, 10, num)
    }
  }
}
</script>

<style lang="scss" scoped>

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

