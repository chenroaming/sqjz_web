<script>
export default {
  components: {},
  props: {
    productObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogTableVisible: false
    }
  },
  mounted() {},
  methods: {
    show() {
      this.dialogTableVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.elCow {
  margin: 10px;
  font-weight: bold;
  font-size: 14px;
}
.t_c {
  display: flex;
}
</style>

<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" title="查看详情">
      <!-- <el-carousel>
        <el-carousel-item
          v-for="(item) in productObj.productPicPaths"
          height="800"
          :key="item"
          :autoplay="false"
        >
          <div
            :style="{backgroundImage:'url('+item+ ')'}"
            :preview-src-list="productObj.productPicPaths"
            style="height: 250px;width: 230px;cursor: pointer;background-size: 100% 100%;"
          />
        </el-carousel-item>
      </el-carousel>-->
      <div class="t_c">
        <div style="box-shadow: 0px 1px 8px #888888;width: 40%;">
          <el-carousel :autoplay="false">
            <el-carousel-item v-for="(item) in productObj.productPicPaths" :key="item">
              <div
                :style="{backgroundImage:'url('+item+ ')'}"
                :preview-src-list="productObj.productPicPaths"
                style="height:100%;width: 100%;cursor: pointer;background-size: 100% 100%;"
              />
            </el-carousel-item>
          </el-carousel>
        </div>

        <div style="padding: 10px;width: 60%;padding-left:40px;">
          <el-row :gutter="20" class="elCow">
            <el-col :span="12">姓名：{{ productObj.name }}</el-col>
            <el-col :span="12">手机号：{{ productObj.phone }}</el-col>
          </el-row>
          <el-row :gutter="20" class="elCow">
            <el-col :span="12">商品名称：{{ productObj.productName }}</el-col>
            <el-col :span="12">商品单价：￥{{ productObj.price }}</el-col>
          </el-row>
          <el-row :gutter="20" class="elCow">
            <el-col :span="12">商品描述：{{ productObj.description }}</el-col>
            <el-col :span="12">联系方式：{{ productObj.contactWay }}</el-col>
          </el-row>
          <el-row :gutter="20" class="elCow">
            <el-col :span="12">是否在售：{{ productObj.isSale }}</el-col>
            <el-col :span="12">审核人：{{ productObj.auditAdmin }}</el-col>
          </el-row>
          <el-row :gutter="20" class="elCow">
            <el-col :span="12">创建时间：{{ productObj.creatTime }}</el-col>
            <el-col :span="12">修改时间：{{ productObj.modifyTime }}</el-col>
          </el-row>
          <el-row :gutter="20" class="elCow">
            <el-col :span="12">审核状态：{{ productObj.auditStateWord }}</el-col>
            <el-col :span="12">审核理由：{{ productObj.auditReason }}</el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
