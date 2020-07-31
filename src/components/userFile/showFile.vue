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
      <div v-if="showType == 4" style="height: 80vh;">
        <video :src="picSrc" style="width: 100%;height: 100%;" controls/>
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
      const fileType = it.name.includes('http')
        ? [...it.name.split('.')].pop()
        : it.name.split('.')[1].toLowerCase()
      this.showType = this.judgType(fileType)
      this.picSrc = this.changePath(it.path, this.showType)
      this.centerDialogVisible = true
    },
    judgType(fileType) { // 文件类型判断
      const getFileType = [
        { fileArr: ['jpg', 'png', 'jpeg', 'bmp', 'gif'], showType: 1 },
        { fileArr: ['pdf'], showType: 2 },
        { fileArr: ['doc', 'docx'], showType: 3 },
        { fileArr: ['mp4'], showType: 4 }
      ]
      const [{ showType }] = getFileType.filter(item => item.fileArr.includes(fileType))
      return showType
    },
    changePath(path, type) { // 文件路径处理
      const action = new Map([
        [1, (path) => path],
        [2, (path) => path],
        [3, (path) => path.includes('http')
          ? `https://view.officeapps.live.com/op/view.aspx?src=${path}`
          : `https://view.officeapps.live.com/op/view.aspx?src=${location.origin}${path}`],
        [4, (path) => path.includes('http')
          ? path
          : `${location.origin}${path}`]
      ])
      return action.get(type)(path)
    }
  }
}
</script>
