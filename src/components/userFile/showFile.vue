<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="查看"
      width="50%"
      fullscreen
      center
      append-to-body>
      <div v-if="showType == 1" style="height: 80vh;">
        <el-image
          :src="picSrc"
          style="width: 100%;height: 100%;"
          fit="fill"/>
      </div>
      <div v-if="showType == 2" style="height: 80vh;">
        <iframe :src="picSrc" width="100%" height="100%" frameborder="0" style="object-fit: fill;"/>
      </div>
      <div v-if="showType == 3" style="height: 80vh;">
        <iframe :src="picSrc" width="100%" height="100%" frameborder="0" style="object-fit: fill;"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ShowFile',
  data() {
    return {
      centerDialogVisible: false,
      picSrc: '',
      showType: 0
    }
  },
  mounted() {

  },
  methods: {
    showEvidence(file) {
      const it = file
      const picture = ['jpg', 'png', 'jpeg', 'bmp', 'gif']
      const pdf = ['pdf']
      const word = ['doc', 'docx']
      const fileType = it.name.split('.')[1].toLowerCase()
      if (this.judgType(picture, fileType)) {
        this.picSrc = it.path
        this.showType = 1
        this.centerDialogVisible = true
        return
      }
      if (this.judgType(pdf, fileType)) {
        this.picSrc = it.path
        this.showType = 2
        this.centerDialogVisible = true
        return
      }
      if (this.judgType(word, fileType)) {
        this.picSrc = `https://view.officeapps.live.com/op/view.aspx?src=${location.origin}${it.path}`
        this.showType = 3
        this.centerDialogVisible = true
      }
    },
    judgType(typeArr, fileType) {
      return typeArr.some(item => {
        return item == fileType
      })
    }
  }
}
</script>
