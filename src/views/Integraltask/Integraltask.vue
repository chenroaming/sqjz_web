<template>
  <div>
    <Searcharea
      v-model="searchData"
      @handleSearch="__init(searchData, 1)"
      @refreshData="handleRefresh"
    >
      <div slot="extraArea">
        <el-input v-model="searchData" placeholder="请输入用户名称" style="width:200px" />
      </div>
      <div slot="eventArea">
        <el-button
          icon="el-icon-plus"
          style="margin:0 10px 0 10px"
          @click="handleUserCurd('ADD_USER')"
        >创建积分任务</el-button>
        <!-- <el-button
          @click="handleFaceCurd()"
          type="success"
          icon="el-icon-refresh"
          style="margin:0 10px 0 5px"
        >更新算法</el-button>-->
      </div>
    </Searcharea>

    <el-table
      :data="tableData"
      class="attendanceTable"
      element-loading-text="数据拼命加载中...."
      height="250px"
      style="width: 100%"
    >
      <el-table-column prop="content" label="任务内容" align="center">
        <template slot-scope="scope">
          <span style="cursor:pointer" @click="handleCheckCurd('CHANGE_TASK', scope.row)">
            {{ scope.row.content }}
            <i class="el-icon-edit-outline" />
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="loginIp" label="登录时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.createDate">{{ scope.row.createDate | setLastLoginTime }}</span>
          <el-tag v-if="!scope.row.createDate" type="info">暂无</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="taskType" label="单次积分" align="center">
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.singleIntegral }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="endTime" label="结束时间" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.clockRuleTimes.length>0">
            <el-tag
              v-for="(value) in scope.row.clockRuleTimes.slice(0,2)"
              :key="value.facesetId"
              type="success"
              size="mini"
              style="margin-right:10px"
            >{{ value.endTime }}</el-tag>
            <el-badge
              v-if="scope.row.clockRuleTimes.length > 2"
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
      </el-table-column>-->
      <el-table-column prop="attendanceType" label="任务类型" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.taskType == 0" type="info">其他</el-tag>
          <el-tag v-if="scope.row.taskType == 1" type="warning">阅读文章</el-tag>
          <el-tag v-if="scope.row.taskType == 2" type="warning">评论文章</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="taskType" label="积分上限" align="center">
        <template slot-scope="scope">
          <el-tag type="warning">{{ scope.row.limitIntegral }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="任务操作" align="center" width="220px">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="handleCheckCurd('LOOK_TASK', scope.row)">详情</el-button> -->
          <!-- <el-button type="primary" size="mini" @click="handleCheckCurd('EXPORT_TASK', scope.row)">导出</el-button> -->
          <el-button type="danger" size="mini" @click="handleCheckCurd('DELETE_TASK', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import Searcharea from '@/components/searcharea/searcharea'
// eslint-disable-next-line no-unused-vars
import { getintegral } from '@/api/attendance'
import { computedFormatTime } from '@/utils/tools'
// 获取积分打卡任务列表
export default {
  components: {
    Searcharea
  },
  filters: {
    // 格式化登录时间
    setLastLoginTime(timeObj) {
      if (timeObj === null) return ''
      return computedFormatTime(timeObj.time)
    }
  },
  data() {
    return {
      searchData: '',
      tableData: [
        {
          content: '测试1'
        }
      ]
      // 搜索框内容
    }
  },
  mounted() {
    this.__init()
  },
  methods: {
    __init() {
      console.log('调用初始化方法')

      getintegral().then(res => {
        console.log(res)
        this.tableData = res.data.list
      })
    },
    // 刷新
    handleRefresh() {
      this.searchData = ''
      this.__init('', 1)
    }
  }
}
</script>

<style scoped>
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
