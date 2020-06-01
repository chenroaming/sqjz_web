<template>
  <el-dialog
    title="考勤条件选择"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    width="40%">
    <el-form label-position="left" label-width="120px">
      <el-form-item label="任务执行时间段">
        <el-select v-model="hasSelectDate" placeholder="请选择" style="width:100%">
          <el-option
            v-for="item in dateList"
            :key="item.date"
            :label="item.date"
            :value="item.date">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务执行人脸库">
        <el-select v-model="hasSelectFaceset" placeholder="请选择"style="width:100%">
          <el-option
            v-for="item in facesetList"
            :key="item.facesetId"
            :label="item.facesetName"
            :value="item.facesetId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleJumpToDetail">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getTaskDate, getTaskFaceset, getAttendanceDetail } from '@/api/attendance';
export default {
  props: {
    dialogVisible: false,
  },

  data () {
    return {
      taskId: '',
      hasSelectDate:'',
      hasSelectFaceset:'',
      dateList: [],
      facesetList: [],
    }
  },

  methods: {
    receiveTaskInfo (taskId) {
      this.taskId = taskId;
      this.getDateList();
      this.getFacesetList();
    },

    // 获取任务执行时间列表
    getDateList () {
      getTaskDate(this.taskId)
      .then(res=>{
        this.dateList = res.data.List;
      }).catch(()=>{});
    },

    // 获取任务执行人脸库列表
    getFacesetList () {
      getTaskFaceset(this.taskId)
      .then(res=>{
        this.facesetList = res.data.List;
      }).catch(()=>{});
    },

    // 跳转到考勤详情页
    handleJumpToDetail (){
      this.$router.push({name:'attendance-detail',
      params:{
        facesetId: this.hasSelectFaceset,
        taskId: this.taskId,
        date: this.hasSelectDate,
        pageSize: 10,
        pageNumber: 1,
      }})
    },

    // 关闭窗口
    handleClose () {
      this.dateList = [];
      this.facesetList = [];
      this.$emit('closeModal');
    }
  }
}
</script>

