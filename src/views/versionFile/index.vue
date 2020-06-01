<template>
  <div class="attendanceTable">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="App类型">
        <el-select v-model="form.appType" style="width: 300px;" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本类型">
        <el-select v-model="form.versionType" style="width: 300px;" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本号">
        <el-input v-model="form.version" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="更新日志">
        <el-input type="textarea" v-model="form.updateLog" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="更新文件">
        <el-upload
          class="upload-demo"
          drag
          action="/community_correction/webClass/versionFile/add.jhtml"
          :auto-upload="false"
          :on-change="selectFile"
          :on-exceed="exceed"
          style="width: 300px;"
          :limit=1>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { versionFile } from "@/api/versionFile";
export default {
  name: "versionFile",
  components:{
    
  },
  data() {
    return {
      options:[{value:1,label:'在矫通'},{value:2,label:'矫务通'}],
      options2:[{value:1,label:'安卓'},{value:2,label:'苹果'}],
      form:{
        appType:'',
        versionType:'',
        version:'',
        updateLog:'',
        file:null
      }
    }
  },
  computed: {

  },
  mounted() {
    
  },
  methods: {
    submit(){
      const pack = new FormData();
      pack.append('appType',this.form.appType);
      pack.append('versionType',this.form.versionType);
      pack.append('version',this.form.version);
      pack.append('updateLog',this.form.updateLog);
      pack.append('file',this.form.file);
      versionFile(pack).then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err)
      })
    },
    selectFile(file){
      this.form.file = file.raw;
    },
    exceed(){
      this.$message.warning('最多只能选择一个文件！，请删除后重新选择！');
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .attendanceTable {
    margin-top: 20px;
  }
</style>
