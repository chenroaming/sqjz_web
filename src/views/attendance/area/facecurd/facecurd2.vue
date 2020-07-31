<template>
  <el-dialog
    :visible.sync="faceCurdModalVisible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
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
      <el-button @click="close">取 消</el-button>
      <el-button :loading="isLoading" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFaceList } from '@/api/face'
import { addFaceInfo, deleteFaceInfo } from '@/api/facelibary'
export default {
  name: 'FaceCurd2',
  props: {
    ruleId: {
      type: String,
      default: ''
    },
    faceCurdModalVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
    faceCurdModalVisible(cur, old) { // 清空搜索框
      !cur &&
      this.$refs['transfer'].clearQuery('left') &&
      this.$refs['transfer'].clearQuery('right')
    }
  },
  methods: {
    show() {
      this.$nextTick(async() => { // 待props传递完成后再触发
        await this.getIsFaceList(this.ruleId)
          .then(res => {
            this.data = res
          })
          .catch(() => {
            this.data = []
          })
        await this.getUnFaceList(this.ruleId)
          .then(res => {
            this.data = this.data.concat(res)
          })
          .catch(() => {})
        this.$emit('update:isLoading', false)
      })
    },
    filterMethod(query, item) {
      return item.name.includes(query) // 搜索的方法
    },
    getIsFaceList(ruleId) { // 获取已关联列表
      return getFaceList('find', ruleId)
        .then(({ data: { state, list }}) => {
          return state === '100' && list ? list : []
        })
    },
    getUnFaceList(ruleId) { // 获取未关联列表
      return getFaceList('add', ruleId)
        .then(({ data: { state, list }}) => {
          this.value = state === '100' && list ? list.map(item => item.userId) : []
          return state === '100' && list ? list : []
        })
    },
    async submit() {
      this.isLoading = true
      await this.handleDel() // 等待删除完成
      await this.handleAdd() // 等待添加完成
      this.isLoading = false
      this.close()
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
        ruleId: this.ruleId,
        userIds: this.addArr.join(',')
      }
      return new Promise((resolve, reject) => {
        this.addArr.length > 0 && addFaceInfo(addArr)
          .then(({ data: { state }}) => {
            resolve(true)
          })
          .catch(() => {
            reject(false)
          })
        this.addArr.length < 1 && resolve(true) // 一定要ressolve出去一个结果，否则async/await不起作用
      })
    },
    handleDel() { // 删除未关联
      const delArr = {
        ruleId: this.ruleId,
        userIds: this.delArr.join(',')
      }
      return new Promise((resolve, reject) => {
        this.delArr.length > 0 && deleteFaceInfo(delArr)
          .then(({ data: { state }}) => {
            resolve(true)
          })
          .catch(() => {
            reject(false)
          })
        this.delArr.length < 1 && resolve(true) // 一定要ressolve出去一个结果，否则async/await不起作用
      })
    },
    close() {
      this.$emit('update:faceCurdModalVisible', false)
    }
  }
}
</script>

<style lang="scss">
  .transferBox {
    .el-transfer__buttons {
      .el-button--primary:nth-child(1){
        background-color: #85ce61;
        border-color: #85ce61;
      }
      .el-button--primary:nth-child(2){
        background-color: #e6a23c;
        border-color: #e6a23c;
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
