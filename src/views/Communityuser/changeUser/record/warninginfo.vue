<script>
  import { find,dispose } from '@/api/warningInfo'
  import tablemix from '@/utils/tablemix'
  export default {
    name:'warninginfo',
    data() {
      return {
        isLoading:false,
        nowPage:1,
        userId:'',
        drawer:false,
        reverse: false,
        activities: [],
        currentPage:1,
        totalPage:0,
        centerDialogVisible:false,
        warningType:['失联','越界','未归','聚集','未报告','未移动','入侵预警'],
        report:{
          reason:'',
          result:'',
          warningId:''
        },
        rules:{
          reason: [
            { required: true, message: '请输入处置理由', trigger: ['blur','change'] },
          ],
          result: [
            { required: true, message: '请输入处置结果', trigger: ['blur','change'] },
          ],
        },
      };
    },
    mixins:[tablemix],
    mounted(){

    },
    watch:{
      centerDialogVisible(cur,old){
        !cur && this.$refs['form'].resetFields()
      }
    },
    computed:{
      isAudio(){
        return this.report.reportType === 2 ? true : false
      }
    },
    methods: {
      show(userId){
        this.userId = userId
        this.currentPage = 1
        this.getList()
      },
      getColor(type){
        const color = new Map([
          [1,'warning'],
          [2,'warning'],
          [3,'info'],
          [4,'danger'],
          [5,'info'],
          [6,'success'],
          [7,'danger']
        ])
        return color.get(type)
      },
      getList(pageNumber = 1){
        find('','',this.userId,pageNumber).then(res => {
          if (res.data.state == 100){
            this.activities = res.data.list.map(item => {
              return {
                ...item,
                warningText: this.warningType[item.warningType - 1],
                warningTime: item.warningDate ? this.exChange(item.warningDate.time) : '',
                missingTime: item.missingDate ? this.exChange(item.missingDate.time) : '',
                recoveryTime: item.recoveryDate ? this.exChange(item.recoveryDate.time) : '',
                color: '#409EFF',
              }
            })
            this.totalPage = res.data.total
            this.drawer = true
            return
          }
          this.activities = []
          this.totalPage = 0
        })
      },
      showDetail(activity){
        this.report = activity
        this.centerDialogVisible = true
      },
      handleCurrentChange(e){
        this.nowPage = e
        this.getList(e)
      },
      submit(){
        this.$refs['form'].validate((valid) => {
          if (!valid){
            return this.$message.warning('请确保选项填写完整！')
          }
          this.isLoading = true
          dispose(this.report.warningId,this.report.reason,this.report.result).then(res => {
            this.isLoading = false
            if(res.data.state == 100){
              this.getList(this.nowPage)
              this.centerDialogVisible = false
            }
          })
          .catch(error => {
            console.log(error)
          })
        })
      },
    }
  };
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 15px;
  }
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>

<template>
  <el-drawer
    title="违规预警记录"
    :visible.sync="drawer">
    <div style="height: calc(100vh - 115px);overflow: auto;">
      <el-timeline :reverse="reverse">
        <transition-group name="el-fade-in">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="activity.warningId"
            :timestamp="activity.warningTime"
            :color="activity.color">
            <el-card>
              <el-tag :type="getColor(activity.warningType)">{{ activity.warningText }}</el-tag>
              <p>
                GPS定位地址：{{ activity.location }}
              </p>
              <p v-if="activity.warningType == 1">
                失联时间：{{ activity.missingTime }}
              </p>
              <p v-if="activity.warningType == 1">
                复联时间：{{ activity.recoveryTime }}
              </p>
              <p v-if="activity.warningType == 4">
                聚集人数：{{ activity.userInfos.length }}
              </p>
              <p v-if="activity.warningType == 4">
                聚集人员：
                <el-tag type="warning" style="margin-right: 5px;" v-for="item in activity.userInfos" :key="item.picPath">{{ item.name }}</el-tag>
              </p>
              <p>
                <el-button type="text" v-if="!activity.disposed" @click="showDetail(activity)">点击处置</el-button>
              </p>
            </el-card>
          </el-timeline-item>
        </transition-group>
      </el-timeline>
    </div>
    <div style="text-align: center;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="totalPage">
      </el-pagination>
    </div>
    <el-dialog
      title="预警处置"
      :visible.sync="centerDialogVisible"
      width="30%"
      append-to-body
      :close-on-click-modal="false"
      center>
      <el-form ref="form" :rules="rules" :model="report" label-width="80px">
        <el-form-item label="发生原因" prop="reason">
          <el-input type="textarea" v-model="report.reason" placeholder="请输入发生原因"></el-input>
        </el-form-item>
        <el-form-item label="处置结果" prop="result">
          <el-input v-model="report.result" placeholder="请输入处置结果"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="isLoading">确 定</el-button>
      </span>
    </el-dialog>
  </el-drawer>
</template>