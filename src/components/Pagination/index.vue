<template>
  <el-pagination
    background
    :current-page="currentPage"
    :page-sizes="pagesizes"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    message: Number
  },
  data() {
    return {
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      total: this.message
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      console.log(this.pagesize)
      this.pagesize = val
      this.$emit('func', [this.pagesize, this.currentPage])
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      console.log(this.currentPage)
      this.currentPage = val
      this.$emit('func', [this.pagesize, this.currentPage])
    }
  }
}
</script>
