<template>
  <div>
    <el-scrollbar class="scrollbar">
      <Search :visible="false" :sear-btn-show="false" v-model="searchData" @refreshData="handleRefresh">
        <span slot="extraArea">
          <el-button
            v-if="checkPermission(['role:operate'])"
            icon="el-icon-plus"
            style="margin: 0 10px 0 10px"
            @click="handleRole('ADD_ROLE')"
          >新增角色</el-button>
        </span>
      </Search>
      <el-table v-loading="isLoading" :data="tableData" :header-cell-style="rowClass" class="tableShadow">
        <el-table-column prop="roleName" label="角色名称" align="center">
          <template slot-scope="scope">
            <span v-if="checkPermission(['role:operate'])" style="cursor:pointer" @click="handleRole('CHANGE_ROLE', scope.row)">
              {{ scope.row.roleName }}
              <i class="el-icon-edit-outline"/>
            </span>
            <span v-else>
              {{ scope.row.roleName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建日期">
          <template slot-scope="scope">{{ scope.row.createDate.time | formatTime }}</template>
        </el-table-column>
        <el-table-column prop="description" label="角色描述" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.description">{{ scope.row.description }}</span>
            <el-tag v-if="!scope.row.description" type="info">暂无</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色类型" align="center">
          <template slot-scope="scope">{{ scope.row.roleType | getRoleTypeName }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="checkPermission(['role:operate'])" type="primary" size="mini" @click="handleRole('UPDATE_AUTH', scope.row)">权限配置</el-button>
            <el-button v-if="checkPermission(['role:operate'])" type="danger" size="mini" @click="handleRole('DELETE_ROLE', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <Sortpage
      :total-pages="total"
      :sort-show="sortShow"
      :current-page="currentPage"
      @sizeChange="handleSizeChange"
    />
    <Rolemodal
      ref="rolesettingsrefs"
      :dialog-visible="modalShow"
      :title="title"
      @closeModal="modalShow=false"
      @requestSuccess="handleRoleCallback('ROLE_SUCCESS')"
    />
    <Auth ref="roleauthrefs" :role="roleObj" />
  </div>
</template>

<script>
import { getRoleList, getRoleList2, deleteRole, deleteRole2 } from '@/api/role'
import { computedFormatTime } from '@/utils/tools'
import sortmix from '@/utils/sortmix'
import Search from '@/components/searcharea/searcharea'
import Sortpage from '@/components/sortpage/sortpage'
import Rolemodal from './rolesettings/rolesettings'
import Auth from './changeroleauth/changeroleauth'
import authmix from '@/utils/authmix'// 引入权限校验
export default {
  components: {
    Search,
    Rolemodal,
    Sortpage,
    Auth
  },

  filters: {
    formatTime(val) {
      return computedFormatTime(val)
    },
    getRoleTypeName(type) {
      switch (type) {
        case 0:
          return '超级管理员'
          break
        case 1:
          return '省级管理员'
          break
        case 2:
          return '市级管理员'
          break
        case 3:
          return '区级管理员'
          break
        case 4:
          return '司法所管理员'
          break
        case 5:
          return '司法人员'
          break
        case 6:
          return '市级管理员'
          break
      }
    }
  },
  mixins: [sortmix],
  mixins: [authmix, sortmix], // 混入文件
  data() {
    return {
      searchData: '',
      modalShow: false,
      authShow: false,
      tableData: [],
      title: '',
      total: 0,
      roleObj: {}
    }
  },

  mounted() {
    this.__init()
  },

  methods: {
    __init(pageSize = 10, pageNumber = 1) {
      getRoleList2(pageSize, pageNumber)
        .then(res => {
          // console.log(res);
          this.pageNumber = res.data.pageNumber
          this.tableData = res.data.list
          this.total = res.data.total
          this.handleResetSort()
        })
        .catch(() => {
          this.tableData = []
          this.isLoading = false
        })
    },

    // 角色操作
    handleRole(action, payload) {
      switch (action) {
        case 'CHANGE_ROLE':
          this.title = '修改角色信息'
          this.modalShow = true
          this.$refs.rolesettingsrefs.sendRoleInfo('CHANGE_ROLE', payload)
          break
        case 'ADD_ROLE':
          this.title = '新增角色信息'
          this.modalShow = true
          this.$refs.rolesettingsrefs.sendRoleInfo('ADD_ROLE', {})
          break
        case 'DELETE_ROLE':
          this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              // return false;
              deleteRole2(payload.roleId)
                .then(res => {
                  this.$message({ type: 'success', message: '删除成功' })
                  this.__init()
                })
                .catch(() => {})
            })
            .catch(() => {})
          break
        case 'UPDATE_AUTH':
          this.roleObj = payload
          this.$refs.roleauthrefs.show(payload)
          break
        default:
          break
      }
    },

    // 操作反馈
    handleRoleCallback(action) {
      switch (action) {
        case 'ROLE_SUCCESS':
          this.modalShow = false
          this.__init()
          break
        default:
          break
      }
    },

    // 分页
    handleSizeChange(num) {
      this.pageNumber = num
      this.__init(10, num)
    },

    // 刷新
    handleRefresh() {
      this.searchData = ''
      this.__init(10, 1)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
