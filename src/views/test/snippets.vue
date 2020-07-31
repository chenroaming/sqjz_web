<template>
  <div>
    <!-- <span>{{ testName }}</span> -->
  </div>
</template>

<script>
export default {
  name: 'VueName',
  props: {
    testName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      msg: 'Welcome to your vueName'
    }
  },
  computed: {
    getName() {
      return this.testName
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.$nextTick(() => {
        console.log(this.getName)
      })
    }
  }
}
</script>

<style scoped lang = "sass">

</style>
