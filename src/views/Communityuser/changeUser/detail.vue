<script>
  import { findRecordDetail } from '@/api/user'
  import tablemix from '@/utils/tablemix'
  export default {
    name:'detail',
    data() {
      return {
        centerDialogVisible:false,
        list:[]
      };
    },
    mixins:[tablemix],
    mounted(){

    },
    methods: {
      show(activity){
        const data = {
          userId:activity.userId,
          date:activity.date
        }
        findRecordDetail(data).then(res => {
          if (res.data.state == 100){
            this.list = res.data.list.map(item => {
              return {
                ...item,
                clockTime:item.clockDate ? this.exChange(item.clockDate.time) : ''
              }
            })
            this.centerDialogVisible = true
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
 .el-row {
    margin-bottom: 30px;
    font-size: 18px;
    font-weight: bold;
  }
</style>

<template>
  <el-dialog
    title="查看详情"
    :visible.sync="centerDialogVisible"
    width="60%"
    append-to-body
    center>
    <el-row :gutter="20" v-for="(item,index) in list" :key="item.detailId">
      <el-col :span="12">
        <el-image :src="item.picPath" style="width: 100%;height: 100%;"></el-image>
      </el-col>
      <el-col :span="12">
        <el-row>
          打卡时间：{{ item.clockTime }}
        </el-row>
        <!-- <el-row>
          开始时间：{{ item.startTime }}
        </el-row>
        <el-row>
          结束时间：{{ item.endTime }}
        </el-row>
        <el-row>
          经度：{{ item.longitude }}
        </el-row>
        <el-row>
          经度：{{ item.latitude }}
        </el-row> -->
        <el-row>
          位置信息：{{ item.location }}
        </el-row>
        <el-row>
          是否偏离：
          <el-tag :type="item.deviate ? 'warning' : 'success'">
            {{ item.deviate ? '是' : '否' }}
          </el-tag>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>