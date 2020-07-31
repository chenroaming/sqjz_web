<script>
import { addFile } from '@/api/user'
import showFile from './showFile.vue'
export default {
  name: 'UserFile',
  components: {
    showFile
  },
  props: {
    userId: {
      type: String,
      default: ''
    },
    // eslint-disable-next-line vue/require-default-prop
    fileType: {
      type: Number
    },
    // eslint-disable-next-line vue/require-default-prop
    fileText: {
      type: String
    },
    userFiles: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileList: [],
      fileInfo: {
        userId: '',
        fileType: this.fileType
      },
      bodyStyle: {
        height: '165px'
      },
      successList: []
    }
  },
  watch: {
    userId(cur, old) {
      this.fileInfo.userId = cur
    },
    userFiles(cur, old) {
      this.successList = this.userFiles
        // eslint-disable-next-line eqeqeq
        .filter(item => item.fileType == this.fileType)
        .map(item => {
          return {
            ...item,
            path: item.filePath,
            name: item.filePath.split('/').pop()
          }
        })
    }
  },
  methods: {
    handleChange(e) {
      if (e.target.files.length < 1) return
      const fileList = Object.values(e.target.files)
      if (fileList.length > 3) {
        return this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${fileList.length} 个文件`
        )
      }
      const formData = new FormData()
      formData.append('userId', this.userId)
      formData.append('fileType', this.fileType)
      for (const item of fileList) {
        formData.append('files', item)
      }
      addFile(formData).then(({ data: { state, list }}) => {
        if (state === '100') {
          this.successList = list.map(item => {
            return {
              name: item.split('/').pop(),
              path: item
            }
          })
        }
      })
    },

    submit() {
      this.$refs.selectFile.click()
    },
    show(item) {
      this.$refs.showFile.showEvidence(item)
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  width: 33%;
  box-shadow: 0px 1px 1px #888888;
  display: inline-block;
  border-radius: 10px;
}
.noupload {
  cursor: pointer;
  // background-color: blue;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <el-card :body-style="bodyStyle" class="box-card" shadow="never">
    <el-button
      v-if="successList.length != 0"
      style="margin-bottom:10px;"
      type="primary"
      size="mini"
      @click="submit"
    >点击补充{{ fileText }}</el-button
    >
    <div v-if="successList.length == 0" class="noupload" @click="submit">
      <img
        src="../../assets/index_images/sc.png"
        style="width:30px;height:20px;margin-right:10px"
      >
      <h4>点击上传{{ fileText }}</h4>
    </div>
    <el-tag
      v-for="(item, index) in successList"
      :key="index"
      type="success"
      style="margin-top:3px;display: block;cursor: pointer;"
      @click="show(item)"
    >{{ item.name }}</el-tag
    >
    <input
      ref="selectFile"
      type="file"
      multiple="multiple"
      style="display: none;"
      @change="handleChange"
    >
    <showFile ref="showFile"/>
  </el-card>
</template>
