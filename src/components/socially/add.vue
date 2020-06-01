<template>
  <el-dialog
    title="发布公益活动"
    :visible.sync="dialogVisible"
    center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="40%">
    <el-form :model="form" ref="form" :rules="rules" label-width="135px">
      <el-form-item prop="theme" label="活动主题">
        <el-input v-model="form.theme"></el-input>
      </el-form-item>
      <el-form-item prop="content" label="活动内容">
        <el-input v-model="form.content"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="location" label="活动地点">
        <el-input v-model="form.location"></el-input>
      </el-form-item> -->
      <el-form-item label="活动地点" prop="location">
        <el-input
          style="margin-top:10px"
          v-if="form.location !=''"
          :value="form.location"
          placeholder="请选择活动地点"
          disabled
        />
        <el-button
          v-if="form.longitude =='' && form.longitude ==''"
          type="primary"
          size="mini"
          @click="showMap = true"
        >添加区域坐标</el-button>
        <el-button
          v-if="form.longitude !='' && form.longitude !=''"
          type="primary"
          size="mini"
          @click="showMap = true"
        >修改区域坐标</el-button>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指派人员" v-if="isChoice">
        <el-button type="primary" @click="getUserList">点击选择指派人员</el-button>
        <el-input type="textarea" v-show="getChoiceList" v-model="getChoiceList" disabled></el-input>
      </el-form-item>
      <el-form-item label="活动起止时间" prop="activeTime">
        <el-date-picker
          v-model="form.activeTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动报名起止时间" prop="applyDate">
        <el-date-picker
          v-model="form.applyDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="状态">
        <el-select v-model="form.state" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="积分">
        <el-input-number v-model="form.integral" :min="1" placeholder="请输入积分"></el-input-number>
      </el-form-item>
      <el-form-item label="限制人数">
        <el-input-number v-model="form.limitedNumber" :min="1" placeholder="请输入限制人数"></el-input-number>
      </el-form-item> -->
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">确 定</el-button>
    </span>
    <userList ref="userList" :assignArr.sync="assignArr"></userList>
    <Getmap ref="getmapRefs" :value="showMap" @map-confirm="getPoint" @cancel="cancelPoint" />
  </el-dialog>
</template>

<script>
  import Getmap from "@/components/getmap/getmap";
  import { add } from '@/api/socially'
  import userList from './userList.vue'
  export default {
    name: "add",
    components:{
      userList,
      Getmap
    },
    data() {
      return {
        dialogVisible:false,
        isLoading:false,
        options:[{value:1,label:'指派'},{value:2,label:'自助报名'}],
        options2:[{value:0,label:'未开始'},{value:1,label:'已开始'},{value:2,label:'已结束'}],
        form:{
          theme:'',
          content:'',
          location:'',
          longitude:'',
          latitude:'',
          type:'',
          startDate:'',
          endDate:'',
          applyStartDate:'',
          applyEndDate:'',
          state:'',
          integral:'',
          limitedNumber:'',
          userIds:'',
          activeTime:[],
          applyDate:[],
        },
        assignArr:[],
        showMap: false,
        rules: {
          theme: [
            { required: true, message: '请输入活动主题', trigger: 'change' },
          ],
          content: [
            { required: true, message: '请输入活动内容', trigger: 'change' }
          ],
          location: [
            {  required: true, message: '请选择活动地点', trigger: 'change' }
          ],
          type: [
            {  required: true, message: '请选择类型', trigger: 'change' }
          ],
          activeTime: [
            { type:'array', message: '请选择活动起止时间', required: true, trigger: 'change' }
          ],
          applyDate: [
            { type:'array', message: '请选择活动报名起止时间', required: true, trigger: 'change' }
          ],
        },
      }
    },
    computed: {
      getChoiceList(){
        return this.assignArr.map(item => item.name).join(',');
      },
      getChoiceListId(){
        return this.assignArr.map(item => item.id).join(',');
      },
      isChoice(){
        return this.form.type === 1 ? true : false;
      }
    },
    mounted() {

    },
    methods: {
      show(){
        this.dialogVisible = true;
      },
      submit(){
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return this.$message.warning('请确保选项填写完整！');
          }
          const [startDate,endDate] = this.form.activeTime;
          const [applyStartDate,applyEndDate] = this.form.applyDate;
          this.form.startDate = startDate;
          this.form.endDate = endDate;
          this.form.applyStartDate = applyStartDate;
          this.form.applyEndDate = applyEndDate;
          this.form.userIds = this.getChoiceListId;
          this.isLoading = true;
          add(this.form).then(res => {
            this.isLoading = false;
            if(res.data.state == 100){
              this.form = {};
              this.dialogVisible = false;
              this.$emit('done');
            }
          })
        });
      },
      getUserList(){
        this.$refs.userList.show()
      },
      getPoint(val) {
        this.showMap = false;
        if (val) {
          this.form.location = val.dw;
          this.form.longitude = val.lng;
          this.form.latitude = val.lat;
        }
      },
      cancelPoint() {
        this.showMap = false;
      },
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
