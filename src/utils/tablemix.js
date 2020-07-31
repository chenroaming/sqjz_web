const mixin = {
  data() {
    return {
      columnWidth: 200,
      picArr: [],
      auditState: ['未审核', '审核通过', '审核不通过'],
      roleArr: ['系统管理员', '省级管理员', '市级管理员', '区级管理员', '司法所管理员', '司法人员', '协矫人员'],
      correctType: [
        { value: 1, label: '三类' },
        { value: 2, label: '二类' },
        { value: 3, label: '一类' }
      ]
    }
  },
  methods: {
    exChange(time) {
      const myDate = new Date(time)
      return `${myDate.getFullYear()}-${(myDate.getMonth() + 1)}-${myDate.getDate()}   ${myDate.getHours()}:${myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()}`
    },
    exChange2(time) {
      const myDate = new Date(time)
      return `${myDate.getFullYear()}-${(myDate.getMonth() + 1)}-${myDate.getDate()}`
    },
    getColor(type) {
      const action = new Map([
        [0, 'info'],
        [1, 'success'],
        [2, 'warning']
      ])
      return action.get(type)
    },
    proofPicPaths(picArr) {
      this.picArr = picArr
      this.$refs.showDetail.show()
    },
    showAudit(applyId) {
      this.auditObj.applyId = applyId
      this.$refs.audit.show()
    }
  }
}

export default mixin
