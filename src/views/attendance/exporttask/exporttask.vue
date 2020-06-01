<template>
  <el-dialog
    title="考勤条件选择"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    width="40%">
    <el-form label-position="left" label-width="120px">
      <el-form-item label="任务执行人脸库">
        <el-select v-model="hasSelectFaceset" placeholder="默认全选" style="width:100%">
          <el-option
            v-for="item in facesetList"
            :key="item.facesetId"
            :label="item.facesetName"
            :value="item.facesetId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务执行时间段" prop="timeRange">
        <el-date-picker
          style="width:100%"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          v-model="timeRange"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleExportXls">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getTaskFaceset,findExportData } from '@/api/attendance';
export default {
  props: {
    dialogVisible: false,
  },

  data () {
    return {
      taskId: '',
      hasSelectDate:'',
      timeRange: [],
      hasSelectFaceset:'',
      dateList: [],
      facesetList: [],
      pickerOptions: {
        disabledDate: this.disabledDate
      }
    }
  },
  mounted(){
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;  
    if(month < 10){
      month = '0'+month;
    }
    var strDate = date.getDate();
    if(strDate < 10){
      strDate = '0'+strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    this.timeRange[0] = currentdate;
    this.timeRange[1] = currentdate;
  },
  methods: {
    disabledDate(time) {
      return time.getTime() >= Date.now();
    },
    receiveTaskInfo (taskId) {
      this.taskId = taskId;
      this.getFacesetList();
    },

    // 获取任务执行人脸库列表
    getFacesetList () {
      getTaskFaceset(this.taskId)
      .then(res=>{
        this.facesetList = res.data.List;
      }).catch(()=>{});
    },

    // 导出任务
    handleExportXls (){
      let msgloding = this.$loading({
        lock: true,
        text: '查询报表中，请耐心等待...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      });
      findExportData(this.hasSelectFaceset,this.taskId,this.timeRange[0],this.timeRange[1])
      .then(res=>{
        msgloding.close(); 
        window.open('/school_administration/webClass/attendance/exportList.jhtml?'+`exportId=${res.data.exportId}`,"_blank"); 
      }).catch(()=>{
        msgloding.close(); 
      });
      setTimeout(() => {
        msgloding.close(); 
      }, 30000);
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

