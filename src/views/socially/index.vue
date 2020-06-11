<template>
  <div>
    <div class="tableBox">
      <div class="select-box">
        <el-button  v-if="checkPermission(['sociallyUsefulActivity:operate'])" type="primary" @click="add">
          <i class="el-icon-circle-plus"></i>
          发布活动
        </el-button>
      </div>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        class="tableShadow"
        :header-cell-style="rowClass"
        element-loading-text="数据拼命加载中...."
      >
        <el-table-column prop="createDate" label="活动创建日期" width="150px" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" align="center">
          <template slot-scope="scope">
            <el-tag>{{scope.row.type}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="活动内容" width="150px" align="center"></el-table-column>
        <el-table-column prop="location" label="活动地点" width="200px" align="center"></el-table-column>
        <el-table-column prop="startDate" label="活动开始日期" width="150px" align="center"></el-table-column>
        <el-table-column prop="endDate" label="活动结束日期" width="150px" align="center"></el-table-column> 
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag>{{scope.row.state}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="communityName" width="150px" label="社区名称" align="center"></el-table-column>
        <el-table-column prop="signUpNum" label="报名人数" align="center"></el-table-column>
        <el-table-column label="操作" width="150px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="show(scope.row)">查看</el-button>
            <el-popconfirm
              title="确认删除吗？"
              @onConfirm="del(scope.row)"
              v-if="checkPermission(['sociallyUsefulActivity:operate'])"
            >
              <el-button type="warning" size="mini" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 20px;text-align: right;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="7"
        layout="total, prev, pager, next"
        :total="totalPage">
      </el-pagination>
    </div>
    <add ref="add" @done="done"></add>
    <detail ref="detail" :userId="userId"></detail>
  </div>
</template>

<script>
  import { findActivityList,deletea } from '@/api/socially'
  import add from '@/components/socially/add.vue'
  import detail from '@/components/socially/detail.vue'
  import authmix from "@/utils/authmix";//引入权限校验
export default {
  name: "sociallyIndex",
  components:{
    add,
    detail
  },
  mixins: [authmix],//混入文件
  data() {
    return {
      visible:false,
      isLoading:false,
      tableData:[],
      currentPage:1,
      totalPage:1,
      userId:'',
      typeArr:[{index:0,label:'选派'},{index:1,label:'自助报名'}],
      stateArr:[{index:0,label:'未开始'},{index:1,label:'已开始'},{index:2,label:'已结束'}],
    }
  },
  computed: {

  },
  mounted() {
    this.getList();
  },
  methods: {
    getList(activityTheme,activityLocation,pageNumber){
      findActivityList(activityTheme,activityLocation,pageNumber).then(res => {
        if(res.data.state == 100){
          const newArr = res.data.list.map(item => {
            return {
              ...item,
              createDate:this.exChange(item.createDate.time),
              endDate:this.exChange(item.endDate.time),
              startDate:this.exChange(item.startDate.time),
              type:this.typeArr[item.type].label,
              state:this.stateArr[item.state].label
            }
          })
          this.tableData = newArr;
          this.totalPage = res.data.total;
          return;
        }
        this.tableData = [];
        this.totalPage = 0;
      })
    },
    add(){
      this.$refs.add.show();
    },
    show(item){
      this.userId = item.id;
      this.$refs.detail.show();
    },
    del(item){
      deletea(item.id).then(res => {
        res.data.state == 100 && this.getList();
      })
    },
    exChange(time){
      return `${new Date(time).getFullYear()}-${(new Date(time).getMonth()+1)}-${new Date(time).getDate()}   ${new Date(time).getHours()}:${new Date(time).getMinutes() < 10 ? '0' + new Date(time).getMinutes() : new Date(time).getMinutes()}`;
    },
    handleCurrentChange(e){
      this.getList('','',e);
    },
    done(){
      this.getList();
      this.currentPage = 1;
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .select-box {
    margin: 20px 0px;
    margin-left: 20px;
  }
</style>
