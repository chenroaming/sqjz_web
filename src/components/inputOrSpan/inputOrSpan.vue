<script>
export default {
  name: 'InputOrSpan',
  functional: true,
  props: {
    isInput: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const self = this
    const { data: { staticClass, attrs: { placeholder }}, props: { isInput, value }} = context
    console.log(staticClass, placeholder, isInput, value)
    if (!isInput) {
      return <el-input on-change={ value } placeholder={ placeholder } class={ staticClass }></el-input>
    } else {
      return <span>{ value }</span>
    }
    // const { data:{ on },props:{ report } } = context
    // const input = (<el-input></el-input>)
    // return wrinfo
  }
}
</script>
