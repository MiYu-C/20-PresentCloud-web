<!--分页-->
<template>
  <el-pagination
    background
    :page-size.sync="page.size"
    :page-sizes="[5, 10, 15, 20]"
    :total="page.total"
    :current-page.sync="page.page"
    style="margin-top: 8px;"
    layout="total, prev, pager, next, sizes"
    @size-change="crud.sizeChangeHandler($event)"
    @current-change="crud.pageChangeHandler"
  />
</template>
<script>
import { pagination } from '@/components/Crud/crud'
export default {
  mixins: [pagination()]
}
</script>
