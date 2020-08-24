const mixin = {
  data() {
    return {
      isLoading: true,
      sortShow: true,
      currentPage: 1,
      pageNumber: 1,
      roleNameArr: {
        0: '超级管理员',
        1: '系统管理员',
        2: '省级管理员',
        3: '市级管理员',
        4: '区级管理员',
        5: '司法所管理员',
        6: '助理员',
        7: '协理员'
      }
    }
  },

  methods: {
    handleResetSort() {
      this.isLoading = true
      this.sortShow = false
      this.currentPage = this.pageNumber
      this.$nextTick(() => {
        this.isLoading = false
        this.sortShow = true
      })
    }
  }
}

export default mixin
