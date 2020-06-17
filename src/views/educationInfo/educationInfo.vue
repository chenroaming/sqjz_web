<script>
  import { find,deleteInfo } from '@/api/educationInfo.js'
  import authmix from '@/utils/authmix.js'
  import tablemix from '@/utils/tablemix.js'
  import showFile from "@/components/userFile/showFile.vue"
  import add from './add.vue'
  export default {
    components: {
      showFile,add
    },
    data() {
      return {
        tableData:[],
        isLoading:false,
        currentPage:1,
        totalPage:0,
        columnW:'200px',
        educationName:'',
      }
    },
    mounted(){
      this.getList()
    },
    mixins: [authmix,tablemix],//混入文件
    methods: {
      getList(educationName,pageNumber = 1,pageSize = 10){
        const data = {
          educationName:educationName,
          pageNumber:pageNumber,
          pageSize:pageSize
        }
        find(data).then(res => {
          if (res.data.state == 100){
            this.tableData = res.data.list.map(item => {
              return {
                ...item,
                createTime:this.exChange(item.createDate.time)
              }
            })
            this.totalPage = res.data.total
            return
          }
          this.tableData = []
          this.totalPage = 0
        })
      },
      handleCurrentChange(e){
        this.getList(this.educationName,e)
      },
      search(){
        this.getList(this.educationName)
      },
      show(item){
        const file = {
          name:item.filePath
        }
        this.$refs.showFile.showEvidence(file)
      },
      add(item){
        this.$refs.add.show(item)
      },
      del({ educationId }){
        const data = {
          educationId:educationId
        }
        deleteInfo(data).then(res => {
          if(res.data.state == 100){
            this.getList()
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  
</style>

<template>
  <div>
    <el-scrollbar class="scrollbar">
      <el-button v-if="checkPermission(['educationInfo:operate'])" type="primary" @click="add" style="margin: 10px;">
        <i class="el-icon-circle-plus"></i>
        新增教育资料
      </el-button>
      <div style="margin: 10px;float: right;">
        <el-input v-model="educationName" style="width: 180px;" placeholder="请输入名称"></el-input>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        class="tableShadow"
        :header-cell-style="rowClass"
        element-loading-text="数据拼命加载中...."
      >
        <el-table-column prop="educationName" label="名称" align="center">
          <template slot-scope="scope">
            <span style="cursor:pointer" @click="add(scope.row)">
              {{ scope.row.educationName }}
              <i class="el-icon-edit-outline" />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="integral" label="积分" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center" :width="columnW"></el-table-column>
        <el-table-column prop="adminName" label="创建人" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="show(scope.row)">预览资料</el-button>
            <el-popconfirm
              title="确认删除？"
              @onConfirm="del(scope.row)"
            >
              <el-button slot="reference" v-if="checkPermission(['educationInfo:operate'])" type="warning" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <div style="margin-top: 20px;text-align: right;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="totalPage">
      </el-pagination>
    </div>
    <showFile ref="showFile"></showFile>
    <add ref="add" @success="getList"></add>
  </div>
</template>