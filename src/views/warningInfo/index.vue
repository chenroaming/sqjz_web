<template>
  <div>
    <el-scrollbar class="scrollbar">
      <div class="select-box">
        <el-button-group>
          <el-button v-for="(item,index) in buttonGroup" :key="index" :class="nowIndex === item.index ? 'isSelect' : ''" type="primary" plain @click="changeSelect(item.index)">{{ item.label }}</el-button>
        </el-button-group>
      </div>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        :header-cell-style="rowClass"
        class="tableShadow"
        element-loading-text="数据拼命加载中...."
      >
        <el-table-column prop="userInfos" label="姓名" align="center">
          <template slot-scope="scope">
            {{ scope.row.userInfos[0].name }}
          </template>
        </el-table-column>
        <el-table-column prop="warningDate" label="预警时间" align="center"/>
        <el-table-column prop="warningType" label="预警类型" align="center">
          <template slot-scope="scope">
            <el-tag :type="getColor(scope.row.warningType)">{{ scope.row.warningType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" align="center"/>
        <el-table-column prop="disposed" label="是否已处置" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.disposed ? 'success' : 'warning'">{{ scope.row.disposedText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showDetail(scope.row)">查 看</el-button>
            <el-button v-if="!scope.row.disposed && checkPermission(['warningInfo:dispose'])" type="warning" size="mini" @click="dispose(scope.row)">处 置</el-button>
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
        @current-change="handleCurrentChange"/>
    </div>
    <disposevue ref="disposevue" :warning-id="warningId" @done="done"/>
    <showDetail ref="showDetail" :detail="detail"/>
  </div>
</template>

<script>
import { find } from '@/api/warningInfo'
import disposevue from '@/components/warningInfo/dispose.vue'
import showDetail from '@/components/warningInfo/showDetail.vue'
import authmix from '@/utils/authmix'// 引入权限校验

export default {
  name: 'WarningInfo',
  components: {
    disposevue,
    showDetail
  },
  mixins: [authmix], // 混入文件
  data() {
    return {
      nowIndex: '',
      currentPage: 1,
      totalPage: 1,
      isLoading: false,
      tableData: [],
      warningType: ['失联', '越界', '未归', '聚集', '未报告', '未移动', '入侵预警'],
      buttonGroup: [{ index: '', label: '全部' }, { index: 1, label: '失联' }, { index: 2, label: '越界' }, { index: 4, label: '聚集' }, { index: 5, label: '未报告' }, { index: 7, label: '入侵预警' }],
      warningId: '',
      detail: {}
    }
  },
  computed: {

  },
  mounted() {
    this.getList()
  },
  methods: {
    getColor(type) {
      const actions = new Map([
        ['失联', 'warning'],
        ['越界', 'warning'],
        // ['未归', 'info'],
        ['聚集', 'danger'],
        ['未报告', 'info'],
        // ['未移动', 'success'],
        ['入侵预警', 'danger']
      ])
      return actions.get(type)
    },
    exChange(time) {
      const myDate = new Date(time)
      return `${myDate.getFullYear()}-${(myDate.getMonth() + 1)}-${myDate.getDate()}   ${myDate.getHours()}:${myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()}`
    },
    getList(warningId = '', warningType = '', userId = '', pageNumber = 1) {
      find(warningId, warningType, userId, pageNumber).then(res => {
        if (res.data.state === '100') {
          const newArr = res.data.list.map(item => {
            return {// 该方法不会改变原数组
              ...item,
              missingDate: item.missingDate ? this.exChange(item.missingDate.time) : '',
              recoveryDate: item.recoveryDate ? this.exChange(item.recoveryDate.time) : '',
              warningType: this.warningType[item.warningType - 1],
              warningDate: this.exChange(item.warningDate.time),
              disposedText: item.disposed ? '是' : '否'
            }
            // 以下方法会改变原数组
            // item.missingDate = item.missingDate ? this.exChange(item.missingDate.time) : '';
            // item.recoveryDate = item.recoveryDate ? this.exChange(item.recoveryDate.time) : '';
            // item.warningType = this.warningType[item.warningType - 1];
            // item.warningDate = this.exChange(item.warningDate.time);
            // item.disposed = item.dispose ? '是' : '否';
            // return item;
          })
          this.tableData = newArr
          this.totalPage = res.data.total
          return
        }
        this.tableData = []
        this.totalPage = 0
      })
    },
    handleCurrentChange(e) {
      this.getList('', this.nowIndex, '', e)
    },
    dispose(item) {
      this.warningId = item.warningId
      this.$refs.disposevue.show()
    },
    done() {
      this.getList()
      this.currentPage = 1
    },
    changeSelect(index) {
      this.nowIndex = index
      this.currentPage = 1
      this.getList('', this.nowIndex)
    },
    showDetail(item) {
      this.detail = item
      this.$refs.showDetail.show()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '@/styles/buttonStyle.scss';

</style>
