<script>
export default {
  name: 'Recursive',
  props: {
    recursiveArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<template>
  <div>
    <div v-for="item in recursiveArr" :key="item.id" style="margin-left: 20px;">
      {{ item.label }}
      <recursive :recursive-arr="item.children"/>
    </div>
  </div>
</template>

