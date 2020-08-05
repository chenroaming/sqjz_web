import { getCommunityUserList } from '@/api/user'
const countMixin = {
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      searchText: ['ageType', 'communityId', 'sex', 'userType', 'date', 'correct'],
      searchParams: {
        pageSize: 5,
        pageNumber: 1
      }
    }
  },
  watch: {
    drawer(cur, old) {
      !cur && (this.searchParams = {
        pageSize: 5,
        pageNumber: 1
      }) && (this.currentPage = 1)
    }
  },
  methods: {
    show(obj) {
      const [...params] = Object
        .keys(obj) // 取出传入对象的key
        .filter(item => { // 过滤出为真的key及对应的值，性别女为0（也就是假），此处单独处理
          return this.searchText.includes(item) && (obj[item] || obj[item] === 0)
        })
      if (params.length === 0) return false // 点击报告统计相关图表不显示
      for (const i of [...params]) {
        this.searchParams[i] = obj[i] // 将数组元素转化为对象中的属性
      }
      this.getList()
    },
    getList() {
      getCommunityUserList(this.searchParams).then(({ data: { state, list, total }}) => {
        this.tableData = state === '100' ? list : []
        this.totalPage = state === '100' ? total : 0
        this.drawer = true
      })
    },
    showDetail(userInfo) {
      this.$router.push({ name: 'change-user', params: userInfo })
    },
    handleCurrentChange(e) {
      this.searchParams.pageNumber = e
      this.getList()
    }
  }
}

export default countMixin
