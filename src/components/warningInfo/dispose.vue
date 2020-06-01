<template>
    <el-dialog
      title="预警信息处置"
      :visible.sync="dialogVisible"
      center
      width="30%">
      <el-form :model="form" label-width="80px">
        <el-form-item label="发生原因">
          <el-input v-model="form.reason"></el-input>
        </el-form-item>
        <el-form-item label="处置结果">
          <el-input v-model="form.result"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="isLoading">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { dispose } from "@/api/warningInfo";
export default {
  name: "disposevue",
  props:{
    warningId:String
  },
  data() {
    return {
      dialogVisible:false,
      isLoading:false,
      form:{
        reason:'',
        result:'',
      }
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    show(){
      this.form = {
        reason:'',
        result:'',
      }
      this.dialogVisible = true;
    },
    submit(){
      this.isLoading = true;
      dispose(this.warningId,this.form.reason,this.form.result).then(res => {
        this.isLoading = false;
        if(res.data.state == 100){
          this.dialogVisible = false;
          this.$emit('done');
        }
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
