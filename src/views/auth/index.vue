<template>
  <div>
    <Search :searBtnShow="false" :visible="false" @refreshData="__init">
      <span slot="eventArea">
        <el-button
          icon="el-icon-plus"
          @click="handleAuth('ADD_AUTH')"
          style="margin:0 10px 0 10px"
        >新增权限</el-button>
      </span>
    </Search>
    <el-table :data="tableData" class="authTable" style="width: 100%">
      <el-table-column prop="authorityName" label="权限名称" align="center">
        <template slot-scope="scope">
          <span style="cursor:pointer" @click="handleAuth('CHANGE_AUTH', scope.row)">
            {{ scope.row.authorityName }}
            <i class="el-icon-edit-outline"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="authorityCode" label="权限代码" align="center"></el-table-column>
      <el-table-column prop="authorityUrl" label="菜单路径" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.authorityUrl == ''?'暂无路径': scope.row.authorityUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限级别" align="center">
        <template slot-scope="scope">
          <el-tag type="danger" size="mini" v-if="scope.row.parentId === 0">总权限</el-tag>
          <el-tag type="primary" size="mini" v-else-if="scope.row.parentId === 1">一级权限</el-tag>
          <el-tag
            type="info"
            size="mini"
            v-else-if="scope.row.parentId !== 0 || scope.row.parentId !== 1"
          >二级权限</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="handleAuth('DELETE_AUTH', scope.row)"
            v-if="scope.row.id !== 1"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Addauth
      @closeModal="addVisible=false"
      @submitSuccess="handleAuthCallBack('ADD_AUTH_SUCCESS')"
      :dialogVisible="addVisible"
      ref="addauthrefs"
    />
    <Changeauth
      @closeModal="changeVisible=false"
      @submitSuccess="handleAuthCallBack('CHANGE_AUTH_SUCCESS')"
      :dialogVisible="changeVisible"
      ref="changeauthrefs"
    />
    <!-- <el-tree :data="data" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]"
      :props="defaultProps">
    </el-tree>-->
  </div>
</template>

<script>
import { getAuthList, deleteAuth } from "@/api/auth";
import Changeauth from "./changeauth/changeauth";
import Addauth from "./addauth/addauth";
import Search from "@/components/searcharea/searcharea";
export default {
  components: {
    Changeauth,
    Addauth,
    Search
  },

  data() {
    return {
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      tableData: [],
      addVisible: false,
      changeVisible: false,
      searchData: "",
      children: [{}],
      lable: "",
      defaultProps: {
        children: "children",
        lable: "lable"
      }
    };
  },

  mounted() {
    // this.__init();
  },

  methods: {
    __init() {
      this.isLoading = true;
      getAuthList()
        .then(res => {
          this.tableData = res.data.List;
          // this.lable = this.tableData.map(item => {
          //   return item = item + authorityName;
          // })
          this.$message({ type: "success", message: "获取成功" });
        })
        .catch(() => {
          this.tableData = [];
        });
    },

    // 权限操作
    handleAuth(action, payload = {}) {
      switch (action) {
        case "ADD_AUTH":
          this.addVisible = true;
          this.$refs.addauthrefs.sendAuthInfo(this.tableData);
          break;
        case "DELETE_AUTH":
          this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              deleteAuth(payload.id)
                .then(res => {
                  this.$message({ type: "success", message: "删除成功" });
                  this.__init();
                })
                .catch(() => {});
            })
            .catch(() => {});
          break;
        case "CHANGE_AUTH":
          this.changeVisible = true;
          this.$refs.changeauthrefs.sendAuthInfo(payload);
          break;
        default:
          break;
      }
    },

    // 反馈
    handleAuthCallBack(action) {
      switch (action) {
        case "CHANGE_AUTH_SUCCESS":
          this.changeVisible = false;
          this.__init();
          break;
        case "ADD_AUTH_SUCCESS":
          this.addVisible = false;
          this.__init();
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.authTable {
  max-height: calc(100vh - 180px);
  min-height: calc(100vh - 180px);
  overflow-y: auto;
}
</style>