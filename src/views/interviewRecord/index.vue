<template>
  <div>
    <el-scrollbar class="scrollbar">
      <div style="width: 98%;margin: 0 auto;">
        <div class="select-box">
          <el-button-group>
            <el-button v-for="(item,index) in buttonGroup" :key="index" :class="nowIndex === item.index ? 'isSelect' : ''" type="primary" plain @click="changeSelect(item.index)">{{ item.label }}</el-button>
          </el-button-group>
        </div>
        <div class="input-box">
          <el-input v-model="currentName" style="width: 200px;" placeholder="请输入名称"/>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="danger" icon="el-icon-refresh" circle @click="refresh" />
        </div>
      </div>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        :header-cell-style="rowClass"
        class="tableShadow"
        element-loading-text="数据拼命加载中...."
      >
        <el-table-column prop="name" label="矫正人员" align="center"/>
        <el-table-column prop="picPath" label="照片" align="center">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.picPath"
              style="width: 100px; height: 100px"/>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" align="center"/>
        <el-table-column prop="interviewType" label="走访类型" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.interviewType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="adminName" label="走访人" align="center"/>
        <el-table-column prop="location" label="矫正人员位置信息" align="center"/>
        <el-table-column :label="nowIndex === 1 ? '查看照片集' : '查看视频'" prop="interviewPicPaths" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showDetail(scope.row)">查看</el-button>
            <el-popconfirm
              title="确认删除该条记录吗？"
              @onConfirm="delDetail(scope.row)"
            >
              <el-button slot="reference" type="warning" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <div style="margin-top: 20px;text-align: right;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="5"
        :total="totalPage"
        hide-on-single-page
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>
    <showDetail ref="showDetail" :interview-pic-paths="interviewPicPaths"/>
    <showFile ref="showFile"/>
  </div>
</template>

<script>
import { find, deleteInfo } from '@/api/interviewRecord'
import showDetail from '@/components/interviewRecord/showDetail.vue'
import showFile from '@/components/userFile/showFile'
export default {
  name: 'InterviewRecord',
  components: {
    showDetail, showFile
  },
  data() {
    return {
      buttonGroup: [{ index: 2, label: '视频走访' }, { index: 1, label: '实地走访' }],
      isLoading: false,
      nowIndex: 2,
      tableData: [],
      currentPage: 1,
      totalPage: 1,
      currentName: '',
      searchName: '',
      interviewPicPaths: []
    }
  },
  computed: {

  },
  mounted() {
    this.getList()
  },
  methods: {
    changeSelect(index) {
      this.nowIndex = index
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange() {
      this.getList()
    },
    search() {
      this.currentPage = 1
      this.searchName = this.currentName
      this.getList()
    },
    showDetail({ interviewPicPaths, filePath }) {
      if (this.nowIndex === 1) {
        this.interviewPicPaths = interviewPicPaths
        this.$refs.showDetail.show()
      } else {
        filePath && window.open(`${location.origin}${filePath}`, '_blank')
        !filePath && this.$message.warning('视频暂未生成！')
      }
    },
    delDetail({ interviewId }) {
      const data = {
        interviewId
      }
      deleteInfo(data).then(({ data: { state }}) => {
        state === '100' && this.getList()
      })
    },
    getList() {
      const data = {
        name: this.searchName,
        interviewType: this.nowIndex,
        pageSize: 5,
        pageNumber: this.currentPage
      }
      find(data).then(res => {
        if (res.data.state === '100') {
          const newArr = res.data.list.map(item => {
            return {
              ...item,
              createDate: this.exChange(item.createDate.time),
              interviewType: this.buttonGroup
                .find(item2 => item.interviewType === item2.index)
                .label
            }
          })
          this.tableData = newArr
          this.totalPage = res.data.total
          return
        }
        this.tableData = []
        this.totalPage = 0
      })
    },
    exChange(time) {
      const myDate = new Date(time)
      return `${myDate.getFullYear()}-${(myDate.getMonth() + 1)}-${myDate.getDate()}   ${myDate.getHours()}:${myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()}`
    },
    refresh() {
      this.currentPage = 1
      this.currentName = ''
      this.searchName = ''
      this.getList()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .select-box {
    width: 50%;
    margin: 20px 0px;
    float: left;
  }
  .input-box {
    width: 30%;
    margin: 20px 0px;
    float: right;
    text-align: right;
  }
  .isSelect {
    background: #409EFF;
    border-color: #409EFF;
    color: #FFF;
  }
</style>
