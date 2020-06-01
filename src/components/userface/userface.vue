<template>
  <div class='faceWrap-mask' :class="addInfoIsShow===true? 'fadeIn' : ''" v-if="addInfoIsShow" style="z-index:1000">
    <div class='faceWrap' >
      <div class='faceWrap-header'>
        <el-button icon="el-icon-close" type="primary" circle size="mini" style="text-align:right" @click="$emit('closeWindow');searchName='';radio = '1'"></el-button>
      </div>
      <div class='faceWrap-body'>
        <div style="text-align:center">
          <!-- <el-radio v-model="radio" label="1" >添加人脸到平台</el-radio>
          <el-radio v-model="radio" label="2">添加人脸到设备</el-radio> -->
          <el-radio-group v-model="radio" @change="changeData">
            <el-radio label="1">添加人脸到平台</el-radio>
            <el-radio label="2">添加人脸到设备</el-radio>
          </el-radio-group>
        </div>
        <div style="height:30px">
          <el-alert
            title="请选择人脸"
            v-show="alertShow"
            type="error">
          </el-alert>
        </div>
        <el-input v-model="searchName" placeholder="请输入姓名查找" style="margin-left:38%;width:150px;margin-bottom:20px" @change="searchList(searchName)"></el-input>
        <el-table
          tooltip-effect="dark"
          class='faceTable'
          height="80px"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          :data="tableData"
          style="width:100%">
          <el-table-column
            type="selection"
            width="55"
            align="center">
          </el-table-column>
          <el-table-column
            label="人脸图像"
            align="center">
            <template slot-scope="scope">
            <img
            :src="scope.row.photoInfos[0].picPath"
            alt=""
            style="width:80px;height:100px;cursor:pointer">
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center">
          </el-table-column>
        </el-table>
        <Sortpage :totalPages="totalPages" @sizeChange="sizeChange" :pageSize="pageSize" class='faceSortPage'/>
      </div>
      <div class='faceWrap-footer' v-if="radio==2">
        <el-button type="primary" @click="addAll" v-if="tableData.length !=0">添加全部</el-button>
        <el-button type="primary" @click="submitFaceList">添加人脸到设备</el-button>
      </div>
      <div class='faceWrap-footer' v-if="radio==1">
        <el-button type="primary" @click="addAll" v-if="tableData.length !=0">添加全部</el-button>
        <el-button type="primary" @click="submitFaceList">添加人脸到平台</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getFaceList,getDeviceFaceList } from "@/api/face";
import { addFaceInfo } from "@/api/facelibary";
import { computedFormatTime } from "@/utils/tools";
import { Message, MessageBox } from 'element-ui';
import Sortpage  from "@/components/sortpage/sortpage";
export default {
  components:{
    Sortpage,
  },

  props: {
    addInfoIsShow:false,
    pageSize: {
      type: Number,
      default: 10,
    }
  },

  data () {
    return {
      tableData: [],
      multipleSelection: [],
      totalPages: 10,
      alertShow: false,
      facesetId: '',
      searchName:'',
      radio:'1'
    }
  },

  filters: {
    formatTime (val) {
      return computedFormatTime(val);
    },
  },

  methods: {
    initList (facesetId = '', name = '', pageSize = this.pageSize, pageNumber = 1) {
      this.facesetId = facesetId;
      getFaceList('', '' , name, pageSize, pageNumber,null,null,'device',this.deviceNumber)
      .then(res=>{
          this.tableData = res.data.List;
          this.totalPages = res.data.total;
      }).catch(()=>{
        this.tableData = [];
        this.totalPages = 0;
      })
    },
    // 接收数据
    receiveInfo (deviceNumber) {
      this.deviceNumber = deviceNumber;
      // console.log('当前设备id'+deviceNumber)
      getDeviceFaceList(this.deviceNumber,'device')
      .then(res=>{
          this.tableData = res.data.List;
          this.totalPages = res.data.total;
      }).catch(()=>{
        this.tableData = [];
        this.totalPages = 0;
      })
    },

    // 全选
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    //重置
    receiveRadio (val) {
      this.radio = '1';
    },
    //分页
    sizeChange(num) {
      if(this.radio == 2){
        getFaceList('', '' , this.searchName, 10, num,null,null,'device',this.deviceNumber)
        .then(res=>{
            this.tableData = res.data.List;
            this.totalPages = res.data.total;
        }).catch(()=>{
          this.tableData = [];
          this.totalPages = 0;
        })
      }else{
        getDeviceFaceList(this.deviceNumber,'device',this.searchName,10,num)
        .then(res=>{
            this.tableData = res.data.List;
            this.totalPages = res.data.total;
        }).catch(()=>{
          this.tableData = [];
          this.totalPages = 0;
        })
      }
    },

    // 提交(1---代表添加人脸都平台，2---代表添加人脸到设备)
    submitFaceList () {
      if(this.radio==1){
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择您要添加的人脸'
          })
        } else {
          this.searchName='';
          this.$emit('sendFaceInfo', this.multipleSelection,1);
        }
      }else{
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择您要添加的人脸'
          })
        } else {
          this.searchName='';
          this.$emit('sendFaceInfo', this.multipleSelection,2);
        }
      }
    },
    //添加全部
    addAll(){
      if(this.radio==1){
        MessageBox.confirm(
          '您确定要将所有人脸添加到该平台嘛？',
          '确定', {
            confirmButtonText: '确定',
            type: 'warning',
            customClass:'alertBox'
          }
        ).then(() => {
          this.searchName='';
          this.$emit('sendFaceInfo', 'addAll',1);
        })
      }else{
        MessageBox.confirm(
          '您确定要将所有人脸添加到该设备嘛？',
          '确定', {
            confirmButtonText: '确定',
            type: 'warning',
            customClass:'alertBox'
          }
        ).then(() => {
          this.searchName='';
          this.$emit('sendFaceInfo', 'addAll',2);
        })
      }
    },
    //搜索
    searchList(){
      if(this.radio == 2){
        getFaceList('', '' , this.searchName, 10, 1,null,null,'device',this.deviceNumber)
        .then(res=>{
            this.tableData = res.data.List;
            this.totalPages = res.data.total;
        }).catch(()=>{
          this.tableData = [];
          this.totalPages = 0;
        })
      }else{
        getDeviceFaceList(this.deviceNumber,'device',this.searchName)
        .then(res=>{
            this.tableData = res.data.List;
            this.totalPages = res.data.total;
        }).catch(()=>{
          this.tableData = [];
          this.totalPages = 0;
        })
      }
      
    },
    //修改数组
    changeData(){
      // console.log(this.radio)
      //清空搜索内容
      this.searchName = '';
      this.multipleSelection = [];
      if(this.radio == 2){
        this.initList();
      }else{
        getDeviceFaceList(this.deviceNumber,'device')
        .then(res=>{
            this.tableData = res.data.List;
            this.totalPages = res.data.total;
        }).catch(()=>{
          this.tableData = [];
          this.totalPages = 0;
        })
      }
    },
  },
  
  beforeDestroy () {
    clearTimeout(this.timer);
  }
}
</script>

<style lang='scss'scoped>
  .faceTable {
    min-height: 650px;
    max-height: 650px;
    overflow-y: auto;
  }
  .faceWrap {
    position: fixed;
    top: 0;
    right: 0;
    width: 40%;
    height: 100%;
    overflow-y: scroll;
    background: rgba(255,255,255,1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    &-header {
      width:100%;
      text-align: right;
      padding:10px;
      cursor: pointer;
    }
    &-footer {
      width: 95%;
      margin: 20px auto;
      text-align: right;
    }
    &-mask {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 20019;
      background: rgba(0, 0, 0, .5);
    }
  }

  .fadeIn {
    animation: fadeIn .2s forwards linear;
  }

  @keyframes fadeIn {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 1;
    }
  }

  .faceSortPage {
    min-height: 50px;
  }
</style>
