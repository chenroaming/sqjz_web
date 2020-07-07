<script>
// 实验性质的函数式组件
export default {
  name: 'CardItem',
  functional: true,
  props: {
    report: {
      type: Object,
      default: () => ({})
    }
  },
  render(h, context) {
    const { data: { on }, props: { report }} = context
    const wrinfo = (
      <el-card>
        <p title={ report.reportContent } class='ellipsis'>报告内容：{ report.reportContent }</p>
        <p>
          <el-button type='text' on-click={ () => on.showDetail(report) }>查看详情</el-button>
        </p>
      </el-card>
    )
    return wrinfo
  }
}
</script>
