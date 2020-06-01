<template>
  <div>
    <Search v-model="searchData" @handleSearch="__init(searchData, searchEvent, 10 ,1)" @refreshData="handleRefresh" :placeholder="'请输入操作员'">
      <span slot="extraArea" style="margin:0 0 0 20px;">
        <el-input v-model="searchEvent" placeholder="请输入操作名称" style="width:200px" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </span>
      <span slot="eventArea">
        <el-button type="danger" style="margin:0 20px 0 20px" @click="handleReset">一键清空</el-button>
      </span>
    </Search>
    <el-table
      :data="tableData"
      class="logTable"
      height="250px"
      v-loading="isLoading"
      style="width: 100%">
      <el-table-column
        prop="operation"
        label="操作名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="ip"
        label="操作来源"
        align="center">
      </el-table-column>
      <el-table-column
        prop="parameter"
        label="操作内容"
        align="center">
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作员"
        align="center">
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate.time |  formatTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button type="danger"  size="mini" @click="handleDelete(scope.row.logId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Sortpage
    :sortShow="sortShow"
    :currentPage="currentPage"
    :totalPages="totalPages"
    @sizeChange="handleSizeChange"/>
  </div>
</template>

<script>
import { getLogList, deleteLog, resetLog } from '@/api/log';
import { computedFormatTime } from '@/utils/tools';
import Search from "@/components/searcharea/searcharea";
import Sortpage from "@/components/sortpage/sortpage";
import sortmix from "@/utils/sortmix";
export default {
  mixins: [sortmix],
  components:{
    Search,
    Sortpage
  },

  data () {
    return {
      tableData: [],
      changeAreaVisible: false,
      addAreaVisible: false,
      totalPages: 0,
      searchData: '',
      searchEvent:'',
    }
  },

  created () {
    this.__init();
  },

  filters: {
    formatTime (val) {
      return computedFormatTime(val);
    }
  },

  methods: {
    __init (operator = '' , operation = '', pageSize = 10, pageNumber = this.pageNumber) {
      getLogList(operator, operation, pageSize, pageNumber)
      .then(res=>{
        this.pageNumber = res.data.pageNumber;
        this.tableData = res.data.List;
        this.totalPages = res.data.total;
        this.$message({type: 'success', message: '获取成功'});
        this.handleResetSort();
      }).catch(()=>{
        this.tableData = [];
        this.isLoading=false;
      });
    },

    // 一键清空
    handleReset () {
    this.$confirm('此操作将永久删除所有日志, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      resetLog().then(res=>{
        this.$message({type: 'success', message: '删除成功'});
        this.__init();
      }).catch(()=>{});
    }).catch(() => {});
    },

    // 删除日志
    handleDelete (id) {
      this.$confirm('此操作将永久删除该日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLog(id).then(res=>{
          this.$message({type: 'success', message: '删除成功'});
          this.__init();
        }).catch(()=>{});
      }).catch(() => {});
    },

    // 分页
    handleSizeChange (num) {
      this.pageNumber = num;
      this.__init(this.searchData, this.searchEvent);
    },

    // 刷新
    handleRefresh () {
      this.searchEvent = '';
      this.__init('', '', 10 ,1);
    }
  }
}
</script>

<style lang='scss' scoped>
  .addBtn {
    position: fixed;
    bottom: 2%;
    right: 2%;
  }
  .logTable {
    max-height: calc(100vh - 180px);
    min-height: calc(100vh - 180px);
    overflow-y: auto;
  }
</style>
