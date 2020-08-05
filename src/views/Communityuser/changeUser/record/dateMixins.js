const dateMixins = {
  data() {
    return {
      years: '',
      months: '',
      yearsList: [{ label: '2020年', value: 2020 }],
      monthsList: []
    }
  },
  methods: {
    initDate() {
      const myDate = new Date()
      /* 小于等于当前月份列表 */
      for (let i = 1; i <= (myDate.getMonth() + 1); i++) {
        const monthItem = {
          label: `${i}月`,
          value: i < 10 ? `0${i}` : i // 小于10的月份前面加0，主要是为了后端能够识别
        }
        this.monthsList.push(monthItem)
      }
      this.years = myDate.getFullYear()
      this.months = myDate.getMonth() + 1 < 10 ? `0${myDate.getMonth() + 1}` : myDate.getMonth() + 1
    }
  }
}

export default dateMixins
