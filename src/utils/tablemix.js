const mixin = {
  data() {
    return {
      columnWidth:200,
      picArr:[],
      auditState:['未审核','审核通过','审核不通过'],
    }
  },
  methods:{
    exChange(time){
      const myDate = new Date(time)
      return `${myDate.getFullYear()}-${(myDate.getMonth()+1)}-${myDate.getDate()}   ${myDate.getHours()}:${myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()}`
    },
    getColor(type){
      const action = new Map([
        [0,'info'],
        [1,'success'],
        [2,'warning']
      ])
      return action.get(type);
    },
    proofPicPaths(picArr){
      this.picArr = picArr;
      this.$refs.showDetail.show();
    },
    showAudit(applyId){
      this.auditObj.applyId = applyId;
      this.$refs.audit.show();
    }
  }
}

export default mixin
