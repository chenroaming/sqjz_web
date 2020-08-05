<script>
export default {
  name: 'Children2',
  data() {
    return {
      word: 'test1'
    }
  }
}
</script>

<template>
  <div style="margin-left: 100px;">
    <span>{{ word }}</span>
    <el-button v-permission="['admin:admin']" type="primary">测试权限按钮</el-button>
  </div>
</template>
