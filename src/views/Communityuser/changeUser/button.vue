<script>
  import trackMap from "@/components/trackMap/trackMap.vue";
  import record from "./record.vue"
  export default {
    name:'buttonBox',
    props: {
      userInfo:{
        type:Object,
        default:() => {}
      }
    },
    components: {
      trackMap,record
    },
    data() {
      return {
        userId:'',
      };
    },
    methods: {
      handleUserCurd(modalType) {
        switch (modalType) {
          case "CHANGE_AUTH":
            const authInfo = {
              userId: this.userInfo.userId,
              name: this.userInfo.name
            };
            this.$refs.trackMap.show(authInfo);
            break;
          case "LOOK_COUNT":
            // this.$router.push({
            //   name: "area-counts",
            //   query: { orderId: this.userInfo.userId }
            // });
            this.$refs.record.show(this.userInfo.userId)
            break;
          default:
            break;
        }
      },
    }
  };
</script>

<style lang="scss" scoped>

</style>

<template>
  <el-card class="box-card" shadow="never">
    <div slot="header">
      <span>操作</span>
    </div>
    <el-button
      size="small"
      type="primary"
      @click="handleUserCurd('CHANGE_AUTH')"
    >查看轨迹</el-button>

    <el-button
      size="small"
      type="primary"
      @click="handleUserCurd('LOOK_COUNT')"
    >报告记录</el-button>
    <trackMap ref="trackMap"></trackMap>
    <record ref="record" :userId="userId"></record>
  </el-card>
</template>