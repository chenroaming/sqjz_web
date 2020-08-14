<template>
  <el-dialog
    :visible.sync="centerDialogVisible"
    :close-on-click-modal="false"
    title="编辑关联人员"
    width="60%"
    center>
    <div class="transferBox">
      <el-transfer
        ref="transfer"
        v-model="value"
        :filter-method="filterMethod"
        :data="data"
        :titles="['已关联人员', '未关联人员']"
        :button-texts="['添加关联', '移除关联']"
        :props="{
          key: 'userId',
          label: 'name'
        }"
        filterable
        filter-placeholder="请输入姓名"
        @change="handleChange"/>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      <el-button :loading="isLoading" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserList2, findUnassociatedList, addRelation, deleteRelation } from '@/api/user'
export default {
  name: 'RelationShip2',
  props: {
    userInfos: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      data: [],
      value: [],
      isLoading: false,
      addArr: [],
      delArr: []
    }
  },
  computed: {

  },
  watch: {
    centerDialogVisible(cur, old) { // 清空搜索框
      !cur &&
      this.$refs['transfer'].clearQuery('left') &&
      this.$refs['transfer'].clearQuery('right')
    }
  },
  methods: {
    show() {
      this.$nextTick(async() => { // 待props传递完成后再触发
        const { adminId } = this.userInfos
        await this.getAssociatedList(adminId)
          .then(res => {
            this.data = res // 先获取已关联数据
          })
          .catch(() => {
            this.data = []
          })
        await this.getUnassociatedList(adminId)
          .then(res => {
            this.data = this.data.concat(res) // 再获取未关联数据
          })
          .catch(() => {})
        this.$emit('update:isLoading', false)
        this.centerDialogVisible = true
      })
    },
    filterMethod(query, item) {
      return item.name.includes(query) // 搜索列表查询方法
    },
    getAssociatedList(adminId) { // 获取已关联列表
      const data = {
        adminId,
        pageNumber: 1
      }
      return getUserList2(data)
        .then(({ data: { state, list: [{ userInfos }] }}) => {
          return state === '100' ? userInfos : []
        })
    },
    getUnassociatedList(adminId) { // 获取未关联列表
      return findUnassociatedList(adminId)
        .then(({ data: { state, list, total }}) => {
          this.value = state === '100' ? list.map(({ userId }) => userId) : []
          return state === '100' ? list : []
        })
    },
    async submit() {
      this.isLoading = true
      await this.handleDel() // 等待删除完成
      await this.handleAdd() // 等待添加完成
      this.$emit('done') // 触发父组件刷新列表
      this.isLoading = false
      this.centerDialogVisible = false
    },
    handleChange(value, direction, movedKeys) { // 当左右侧数据变化时，添加相应的已关联数组和未关联数组
      this.addArr = this.data
        .filter(item => !value.includes(item.userId))
        .map(({ userId }) => userId)
      this.delArr = this.data
        .filter(item => value.includes(item.userId))
        .map(({ userId }) => userId)
    },
    handleAdd() { // 添加已关联
      const addArr = {
        adminId: this.userInfos.adminId,
        userIds: this.addArr.join(',')
      }
      return new Promise((resolve, reject) => { // 将Promise的结果进行返回
        this.addArr.length > 0 && addRelation(addArr)
          .then(({ data: { state }}) => {
            resolve(true) // 一定要resolve出去一个结果，否则async/await不起作用
          })
          .catch(() => {
            reject(false)
          })
        this.addArr.length < 1 && resolve(true) // 一定要resolve出去一个结果，否则async/await不起作用
      })
    },
    handleDel() { // 删除未关联
      const delArr = {
        adminId: this.userInfos.adminId,
        userIds: this.delArr.join(',')
      }
      return new Promise((resolve, reject) => { // 将Promise的结果进行返回
        this.delArr.length > 0 && deleteRelation(delArr)
          .then(({ data: { state }}) => {
            resolve(true) // 一定要resolve出去一个结果，否则async/await不起作用
          })
          .catch(() => {
            reject(false)
          })
        this.delArr.length < 1 && resolve(true) // 一定要resolve出去一个结果，否则async/await不起作用
      })
    }
  }
}
</script>

<style lang="scss">
  /* 更改穿梭框按钮样式 */
  .transferBox {
    .el-transfer__buttons {
      width: 190px;
      text-align: center;
      .el-button--primary:nth-child(1){
        background-color: #85ce61;
        border-color: #85ce61;
      }
      .el-button--primary:nth-child(2){
        background-color: #e6a23c;
        border-color: #e6a23c;
        margin-left: 0;
        width: 117px;
      }
    }
  }
</style>

<style scoped lang = "scss">
  .transferBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 800px;
    margin:0 auto;
  }
</style>
