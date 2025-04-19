<template>
  <el-container>
    <el-main>
      <books class="books-area" ref="booksArea"></books>
    </el-main>
  </el-container>
</template>

<script>
  import Books from './Books'

  export default {
    name: 'AppLibrary',
    components: {Books},
    methods: {
      listByCategory () {
        var _this = this
        var cid = this.$refs.sideMenu.cid
        var url = 'categories/' + cid + '/books'
        this.$axios.get(url).then(resp => {
          if (resp && resp.data.code === 200) {
            _this.$refs.booksArea.books = resp.data.result
            _this.$refs.booksArea.currentPage = 1
          }
        })
      }
    }
  }
</script>

<style scoped>
  .books-area {
    width: 990px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
