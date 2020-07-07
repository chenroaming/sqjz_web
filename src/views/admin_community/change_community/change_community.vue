<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
    title="修改区域名称"
    width="35%"
  >
    <el-form ref="form" :model="community" label-width="120px">
      <el-form-item label="司法所名称">
        <el-input v-model="community.communityName"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('modalClose')">取 消</el-button>
      <el-button type="primary" @click="submitForm()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { update } from '@/api/community.js'
export default {
  props: {
    dialogVisible: false
  },
  data() {
    return {
      community: {
        communityName: '',
        communityId: ''
      }
    }
  },
  methods: {
    show({ communityName, communityId }) {
      this.community.communityName = communityName
      this.community.communityId = communityId
    },
    submitForm() {
      const { communityId, communityName } = this.community
      update(communityId, communityName).then(res => {
        // eslint-disable-next-line eqeqeq
        res.data.state == 100 && this.$emit('submitSuccess')
      })
    }
  }
}
</script>

<style scoped>
</style>
