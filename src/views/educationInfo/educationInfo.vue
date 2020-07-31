<script>
import { find, deleteInfo } from '@/api/educationInfo.js'
import authmix from '@/utils/authmix.js'
import tablemix from '@/utils/tablemix.js'
import showFile from '@/components/userFile/showFile.vue'
import add from './add.vue'
export default {
  components: {
    showFile, add
  },
  mixins: [authmix, tablemix],
  data() {
    return {
      tableData: [],
      isLoading: false,
      currentPage: 1,
      totalPage: 0,
      columnW: '200px',
      educationName: '',
      searchName: ''
    }
  },
  mounted() {
    this.getList()
  }, // 混入文件
  methods: {
    getList() {
      const data = {
        educationName: this.searchName,
        pageNumber: this.currentPage,
        pageSize: 10
      }
      find(data).then(res => {
        if (res.data.state === '100') {
          this.tableData = res.data.list.map(item => {
            return {
              ...item,
              createTime: this.exChange(item.createDate.time)
            }
          })
          this.totalPage = res.data.total
          return
        }
        this.tableData = []
        this.totalPage = 0
      })
    },
    handleCurrentChange(e) {
      this.getList()
    },
    search() {
      this.searchName = this.educationName
      this.getList()
    },
    show(item) {
      const file = {
        name: item.fileLink,
        path: item.fileLink
      }
      this.$refs.showFile.showEvidence(file)
    },
    add(item) {
      this.$refs.add.show(item)
    },
    del({ educationId }) {
      const data = {
        educationId: educationId
      }
      deleteInfo(data).then(res => {
        if (res.data.state === '100') {
          this.getList()
        }
      })
    },
    refresh() {
      this.searchName = ''
      this.educationName = ''
      this.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <div>
    <el-scrollbar class="scrollbar">
      <el-button v-if="checkPermission(['educationInfo:operate'])" type="primary" style="margin: 10px;" @click="add">
        <i class="el-icon-circle-plus"/>
        新增教育资料
      </el-button>
      <div style="margin: 10px;float: right;">
        <el-input v-model="educationName" style="width: 180px;" placeholder="请输入名称"/>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="danger" icon="el-icon-refresh" circle @click="refresh" />
      </div>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        :header-cell-style="rowClass"
        class="tableShadow"
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
        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column prop="integral" label="积分" align="center"/>
        <el-table-column :width="columnW" prop="description" label="描述" align="center"/>
        <el-table-column prop="adminName" label="创建人" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="show(scope.row)">预览资料</el-button>
            <el-popconfirm
              title="确认删除？"
              @onConfirm="del(scope.row)"
            >
              <el-button v-if="checkPermission(['educationInfo:operate'])" slot="reference" type="warning" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <div style="margin-top: 20px;text-align: right;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="10"
        :total="totalPage"
        layout="total, prev, pager, next"
        hide-on-single-page
        @current-change="handleCurrentChange"/>
    </div>
    <showFile ref="showFile"/>
    <add ref="add" @success="getList"/>
  </div>
</template>
