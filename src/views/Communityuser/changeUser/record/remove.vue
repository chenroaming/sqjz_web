<script>
import { resetPhoneInfo } from '@/api/user'
export default {
  name: 'Remove',
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      picSrc: require('../../../../assets/index_images/reset.png')
    }
  },
  methods: {
    resetPhone() {
      this.$confirm('确认解矫该用户吗?', '解除矫正', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPhoneInfo(this.userId).then(({ data: { state, message }}) => {
          state == 100 && this.$message.success(message)
          return this.$message.warning(message)
        })
      }).catch(() => {})
    }
  }
}
</script>

  <style lang="scss" scoped>
    .c_cz {
      border-radius: 10px;
      margin: 0 auto;
      width: 80%;
      box-shadow: 0px 1px 8px #888888;
      padding: 10px;
      cursor: pointer;
      display: flex;
      font-size: 12px;
      justify-content: center;
      align-items: center;
    }
  </style>

<template>
  <el-col v-permission="['user:operate']" :span="8">
    <div class="c_cz" @click="resetPhone">
      <img
        :src="picSrc"
        style="width:20px;height:20px;"
      >
      <span style="margin-left:5px">
        <b>解除矫正</b>
      </span>
    </div>
  </el-col>
</template>
