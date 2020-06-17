<script>
import { findList } from "@/api/product.js";
import authmix from "@/utils/authmix.js";
import tablemix from "@/utils/tablemix.js";
import showDetail from "./showDetail.vue";
import audit from "./audit.vue";
export default {
  components: {
    showDetail,
    audit
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      isLoading: false,
      auditArr: ["未审核", "审核通过", "审核不通过"],
      columnW: "150px",
      productName: "",
      name: "",
      productObj: {},
      productId: "",
      centerDialogVisible: false
    };
  },
  filters: {
    gettext(text) {
      const type = new Map([
        [1, "审核通过"],
        [2, "审核不通过"],
        [0, "未审核"]
      ]);
      return type.get(text);
    }
  },
  mounted() {
    this.getList();
  },
  mixins: [authmix, tablemix], //混入文件
  computed: {
    hasData() {
      return this.tableData.length > 0 ? true : false
    }
  },
  methods: {
    getList(
      productName = "",
      name = "",
      auditState = "",
      pageNumber = 1,
      pageSize = 6
    ) {
      const data = {
        productName: productName,
        name: name,
        auditState: auditState,
        pageNumber: pageNumber,
        pageSize: pageSize
      };
      findList(data).then(res => {
        if (res.data.state == 100) {
          // const n = 4; //每行显示个数
          this.tableData = res.data.list.map(item => {
            return {
              ...item,
              isSale: item.onSale ? "是" : "否",
              auditStateWord: this.auditArr[item.auditState],
              creatTime: this.exChange(item.createDate.time),
              modifyTime: this.exChange(item.modifyDate.time)
            }
          })
          this.totalPage = res.data.total
          return
        }
        this.tableData = []
        this.totalPage = 0
      });
    },
    handleCurrentChange(e) {
      this.getList(this.productName, this.name, "", e)
    },
    search() {
      this.getList(this.productName, this.name)
    },
    showDetail(item) {
      this.productObj = item;
      this.$refs.showDetail.show()
    },
    audit(productId) {
      this.productId = productId
      this.$refs.audit.show()
    },
    arrTrans(num, arr) {
      //卡片分行处理
      const newArr = [];
      for (let i = 0; i < Math.ceil(arr.length % num); i++) {
        newArr.push(arr.slice(num * i, num * i + num))
      }
      return newArr
    },
    getColor(text) {
      const type = new Map([
        [1, "success"],
        [0, "info"],
        [2, "warning"]
      ])
      return type.get(text)
    }
  }
};
</script>

<style lang="scss" scoped>
  .attendanceTable {
    max-height: calc(100vh - 180px);
    min-height: calc(100vh - 180px);
    overflow-y: auto;
  }
  .title {
    font-weight: bold;
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    width: 90%;
  }
  .description {
    display: inline-block;
    width: 100%;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .price {
    color: brown;
  }
</style>

<template>
  <div>
    <div style="margin: 10px;padding:30px;border-bottom:2px solid #009df7">
      <el-input v-model="productName" style="width: 180px;" placeholder="请输入产品名称"></el-input>
      <el-input v-model="name" style="width: 180px;" placeholder="请输入矫正人员姓名"></el-input>
      <el-button type="primary" @click="search">搜索</el-button>
    </div>
    <div style="padding: 10px 30px;">
      <h3 style="margin:0">商品管理列表</h3>
      <p v-if="!hasData" style="text-align: center;">暂无数据</p>
      <el-row :gutter="10" style="margin-top: 20px;">
        <transition-group name="el-fade-in-linear">
          <el-col :span="4" v-for="(item2,index2) in tableData" :key="item2.productId">
            <el-card style="width: 100%;height: 450px;">
              <el-image style="cursor: pointer;height: 250px;" :title="item2.productName" :src="item2.productPicPaths[0]" @click="showDetail(item2)"></el-image>
              <div style="padding: 14px;">
                <span class="title" :title="item2.productName">{{ item2.productName }}</span>
                <p class="price">
                  <el-tag type="warning" size="mini">￥{{ item2.price }}</el-tag>
                  <el-tag :type="getColor(item2.auditState)" size="mini">{{ auditArr[item2.auditState] }}</el-tag>
                </p>
                <div class="bottom clearfix">
                  <span :title="item2.description" class="description">商品描述：{{ item2.description }}</span>
                  <el-button
                    type="warning"
                    size="mini"
                    v-if="checkPermission(['productInfo:audit']) && item2.auditState == 0"
                    @click="audit(item2.productId)"
                  >审核</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </transition-group>
      </el-row>
    </div>
    <div v-if="hasData" style="margin-top: 20px;text-align: right;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="6"
        layout="total, prev, pager, next"
        :total="totalPage"
      ></el-pagination>
    </div>
    <showDetail ref="showDetail" :productObj="productObj"></showDetail>
    <audit ref="audit" @handleSuccess="getList" :productId="productId"></audit>
  </div>
</template>