<script>
import { getUserList2, findUnassociatedList, addRelation, deleteRelation } from '@/api/user'
export default {
  name: 'RelationShip',
  props: {
    userInfos: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      drawer: false,
      tableData: [],
      direction: 'rtl',
      nowIndex: 1,
      buttonGroup: [{ index: 1, label: '已关联人员' }, { index: 2, label: '未关联人员' }],
      mutipleSelection: [],
      selection: {
        adminId: '',
        userIds: ''
      }
    }
  },
  computed: {
    countChoice() {
      return this.mutipleSelection.length
    },
    buttonText() {
      return this.nowIndex === 1 ? '移除关联用户' : '添加关联用户'
    },
    buttonColor() {
      return this.nowIndex === 1 ? 'warning' : 'success'
    }
  },
  watch: {
    userInfos({ adminId }, old) {
      this.getList(adminId)
      this.selection.adminId = adminId
    }
  },
  methods: {
    show() {
      this.nowIndex = 1
      this.drawer = true
    },
    handleRelation() {
      this.nowIndex === 1 && deleteRelation(this.selection).then(({ data: { state }}) => {
        // eslint-disable-next-line eqeqeq
        state == 100 && this.getList(this.userInfos.adminId) && this.$emit('done')
      })
      this.nowIndex === 2 && addRelation(this.selection).then(({ data: { state }}) => {
        // eslint-disable-next-line eqeqeq
        state == 100 && this.getList2() && this.$emit('done')
      })
    },
    getList(adminId) {
      getUserList2('', 1, adminId).then(({ data }) => {
        this.tableData = data.list[0].userInfos
        this.totalPage = data.total
      })
      return true
    },
    getList2() {
      findUnassociatedList(this.userInfos.adminId).then(({ data: { list, total }}) => {
        this.tableData = list
        this.totalPage = total
      })
      return true
    },
    handleSelectionChange(val) {
      this.mutipleSelection = val
      this.selection.userIds = this.mutipleSelection
        .map(item => item.userId)
        .join(',')
    },
    changeSelect(index) {
      if (this.nowIndex === index) return false
      this.nowIndex = index
      index === 1 && this.getList(this.userInfos.adminId)
      index === 2 && this.getList2(this.userInfos.adminId)
    }
  }
}
</script>

<style lang="scss" scoped>
  $borderColor:#409EFF;
  .isSelect {
    background: $borderColor;
    border-color: $borderColor;
    color: #FFF;
  }
  .scrollbar2 {
    height: calc( 100vh - 150px );
  }
</style>

<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    title="矫正分组">
    <el-button-group style="margin-left: 10px;">
      <el-button v-for="item in buttonGroup" :key="item.index" :class="nowIndex === item.index ? 'isSelect' : ''" type="primary" size="mini" plain @click="changeSelect(item.index)">{{ item.label }}</el-button>
    </el-button-group>
    <el-scrollbar class="scrollbar2">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"/>
        <el-table-column
          prop="picPath"
          label="照片"
          align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.picPath" style="width: 150px;height: 150px;"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="120"/>
      </el-table>
    </el-scrollbar>
    <div style="width: 80%;margin: 0 auto;text-align: center;margin-top: 10px;">
      <el-badge :value="countChoice" class="item">
        <el-button :type="buttonColor" size="mini" @click="handleRelation">{{ buttonText }}</el-button>
      </el-badge>
    </div>
  </el-drawer>
</template>
