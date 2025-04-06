<template>
  <div class="quick-nav" style="display: none;">
    <!-- 你的内容 -->
  </div>
</template>

<script>
  export default {
    name: 'QuickNav'
  }
</script>

<style scoped>
  .quick-nav {
    width: 0;
    height: 0;
    background-color: transparent;
    display: none; /* 使得组件完全不占空间 */
  }
</style>