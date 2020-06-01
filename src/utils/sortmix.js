const mixin = {
  data() {
    return {
      isLoading: true,
      sortShow: true,
      currentPage: 1,
      pageNumber: 1
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
