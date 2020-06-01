<template>
  <el-dialog
    title="个人考勤时长统计记录"
    :visible.sync="dialogVisible"
    :close-on-click-modal="true"
    @close="$emit('update:dialogVisible', false)"
    :show-close="false"
    width="70%"
    :center=true
  >
    <div class="charts">
      <ve-line :data="chartData" :settings="chartSettings" height="350px" width="1000px"></ve-line>
    </div>
  </el-dialog>
</template>

<script>
import { personRecordCount } from '@/api/attendance';


export default {
  props: {
    dialogVisible: {
      default: false
    }
  },

  data() {
    this.chartSettings = {
      stack: { '用户': ['访问用户', '下单用户'] },
      yAxisName: ['考勤时长（分钟）'],
      area: true
    }
    return {
      chartData: {
        columns: ['日期', '考勤时长'],
        rows: [
        ]
      },
      show: this.dialogVisible
    };
  },

  methods: {
    getList(id,strary,startime,endtime){
      personRecordCount(id,strary,startime,endtime)
      .then(res=>{   
        this.chartData.rows = res.data.List.map(item=>{
          return {'日期': item.date, '考勤时长': item.duration};
        })
      }).catch(()=>{
        
      });
    }
  }
};
</script>

<style>
.charts {
  margin: 5px 5px;
  width: 100%;
  height: 320px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  justify-content: center
}
</style>
