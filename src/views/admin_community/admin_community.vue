<template>
  <div>
    <div class="tableBox">
      <Search
        v-model="searchData"
        :placeholder="'请输入操作员'"
        @handleSearch="__init()"
        @refreshData="handleRefresh"
      >
        <span slot="extraArea" style="margin:0 0 0 20px;">
          <el-input v-model="searchname" placeholder="请输区域名称" style="width:200px" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
        </span>
        <span slot="eventArea">
          <el-button
            type="success"
            style="margin:0 20px 0 20px"
            @click="addcommuntiyCurd('ADD_community')"
            v-if="checkPermission(['community:operate'])"
          >创建新区域</el-button>
        </span>
      </Search>

      <el-table v-loading="isLoading" class="tableShadow" :header-cell-style="rowClass" :data="tableData">
        <!-- <el-table-column prop="communityName" label="司法所名称" align="center" /> -->
        <el-table-column prop="communityName" label="司法所名称" align="center">
          <template slot-scope="scope">
            <span v-if="checkPermission(['community:operate'])" style="cursor:pointer" @click="addcommuntiyCurd('CHANGE', scope.row)">
              {{ scope.row.communityName }}
              <i class="el-icon-edit-outline" />
            </span>
            <span v-else>
              {{ scope.row.communityName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="areaName" label="所属区域" align="center" />
        <!-- <el-table-column prop="parameter" label="操作内容" align="center" />
        <el-table-column prop="operator" label="操作员" align="center" />-->
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createDate.time | formatTime }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" v-if="checkPermission(['community:operate'])" size="mini" @click="handleDelete(scope.row.communityId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <Addcommunity
      ref="addcommunity"
      :dialog-visible="addcommunity"
      @closeModal="addcommunity=false"
      @submitSuccess="handleUserSuccess('ADD_community')"
    />

    <changecommunity
      ref="changecommunity"
      :dialog-visible="changecommunity"
      @modalClose="changecommunity=false"
      @submitSuccess="handleUserSuccess('CHANGE_USER_INFO_SUCCESS')"
    />
  </div>
</template>

<script>
import { getcommunity, delcommunity } from "@/api/community";
// 引入使用的api
import { computedFormatTime } from "@/utils/tools";
// 引入转时间戳工具
import Search from "@/components/searcharea/searcharea";
// 搜索组件
import Sortpage from "@/components/sortpage/sortpage";
// 分页组件
import Addcommunity from "./add_community/add_community";
// 添加区域组件(组件)
import changecommunity from "./change_community/change_community";
// 修改区域组件(组件)
import authmix from "@/utils/authmix";
//引入权限校验
export default {
  // 使用的组件
  components: {
    Search,
    Sortpage,
    Addcommunity,
    changecommunity
  },
  mixins: [authmix],//混入文件
  filters: {
    formatTime(val) {
      return computedFormatTime(val);
    }
  },
  data() {
    return {
      pageSize: 20,
      // 页数(每页几条)
      pageNumber: 1,
      // 第几页
      tableData: [],
      searchData: "",
      searchname: "",
      // 搜索名称
      addcommunity: false,
      // 控制添加组件
      changecommunity: false
      // 控制修改组件
    };
  },
  created() {
    this.__init();
  },
  methods: {
    // 初始化方法
    __init() {
      this.isLoading = false;
      getcommunity(this.pageSize, this.pageNumber, this.searchname).then(
        res => {
          console.log(res.data);
          if (res.data.state == "100" || res.data.state == 100) {
            this.tableData = res.data.list;
          }
        }
      );
    },
    addcommuntiyCurd(modalType, payload = {}) {
      //   alert(modalType);
      switch (modalType) {
        case "ADD_community":
          this.$refs.addcommunity.__init();
          this.addcommunity = true;
          break;
        case "CHANGE":
          this.changecommunity = true;
          this.$refs.changecommunity.show(payload)
          break;
      }
    },
    // 模态框成功回调
    handleUserSuccess(modalType) {
      switch (modalType) {
        case "ADD_community":
          this.addcommunity = false;
          this.__init();
          break;
        case "CHANGE_USER_INFO_SUCCESS":
          this.changecommunity = false;
          this.__init();
          break;
      }
    },
    // 重置按钮
    handleRefresh() {
      this.__init();
    },
    // 删除区域
    handleDelete(id) {
      // alert('删除')
      console.log(id);

      this.$confirm("此操作将永久删除该区域, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delcommunity(id)
            .then(() => {
              this.$message({ type: "success", message: "删除成功" });
              this.__init();
            })
            .catch(() => {});
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}
</style>
