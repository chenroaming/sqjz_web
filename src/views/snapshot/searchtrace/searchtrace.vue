<template>
  <el-dialog title="抓拍记录识别" :visible.sync="dialogVisible" :close-on-click-modal="false" :show-close="false" width="60%">
    <el-form label-position="left" label-width="120px" class="faceForm">
      <el-form-item label="人脸相片" required>
        <el-upload class="avatar-uploader" action="" :show-file-list="false" accept="image/jpeg" :auto-upload="false"
          :on-change="handleChange">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item class="itemArea" v-show="showObj">
        <el-card :body-style="{ padding: '0px' }" class="contentArea">
          <img :src="searchObj.picPath">
          <div style="padding: 3px 10px;">
            <h3 style="text-align:center">识别结果</h3>
            <p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 名&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;{{searchObj.name}}</p>
            <p> 相&nbsp;&nbsp;&nbsp;似&nbsp;&nbsp;&nbsp;度 : &nbsp;&nbsp;&nbsp;{{searchObj.similarity | similarityPercent}}
            </p>
            <p>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 别&nbsp;&nbsp;:
              &nbsp;&nbsp;&nbsp;{{searchObj.gender ==0?'男':'女'}}</p>
            <!-- <p>所在人脸库: &nbsp;&nbsp;&nbsp;纵横大学</p> -->
          </div>
        </el-card>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="isSubmit">查看人脸轨迹</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getListByImageFile } from "@/api/snapshot";
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        showObj: false,
        imageUrl: '',
        isSubmit: false,
        file: null,
        searchObj: {
          name: 'xxx',
          picPath: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          similarity: 0.666,
          gender: 0
        }
      }
    },
    filters: {
      similarityPercent(val) {
        if (val == 1) {
          return '100%';
        } else {
          let beforeDot = parseFloat(val).toFixed(4).split('.')[1].slice(0, 2);
          let afterDot = parseFloat(val).toFixed(4).split('.')[1].slice(2, 4);
          return beforeDot + '.' + afterDot + '%';
        }
      }
    },
    methods: {
      // 关闭
      handleClose() {
        this.imageUrl = '';
        this.searchObj = {
          name: 'xxx',
          picPath: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          similarity: 0.666,
          gender: 0
        }
        this.showObj = false;
        this.file = null;
        this.$emit('closeModal');
      },

      // 获取file
      handleChange(res) {
        this.imageUrl = URL.createObjectURL(res.raw);
        this.file = res.raw;
      },

      // 提交
      handleSubmit() {
        if (this.file === null) {
          this.$message({
            type: 'error',
            message: '请上传要识别的图片'
          });
        } else {
          let formData = new FormData();
          this.isSubmit = true;
          formData.append('file', this.file);
          getListByImageFile(formData)
            .then(res => {
              this.isSubmit = false;
              // this.imageUrl = '';
              // this.file = null;
              this.showObj = true;
              this.searchObj.name = res.data.name;
              this.searchObj.picPath = res.data.picPath;
              this.searchObj.similarity = res.data.similarity;
              this.searchObj.gender = res.data.gender;
              this.$message({ type: 'success', message: '识别成功' });
              this.$emit('submitSuccess', res.data.faceId);
              this.$emit('closeModal');

            }).catch(() => {
              this.isSubmit = false;
            });
        }
      },
    }
  }
</script>

<style lang="scss">
  .contentArea {
    display: flex;
    justify-content: space-around;
    margin: 0;
    width: 350px;
    flex-wrap: nowrap;
  }

  .itemArea {
    display: flex;
    justify-content: space-around;
    width: 60%;
  }

  .contentArea img {
    width: 150px;
    height: 190px;
    margin: 0 auto;
    display: inline-block;
  }

  .faceForm {
    display: flex;
    justify-content: space-around;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 190px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 150px;
    height: 190px;
    display: block;
  }
</style>