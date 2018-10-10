
<template>
  <div class="pagination">
    <el-pagination
      align="center"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      layout="prev, pager, next, jumper, sizes"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number
    }
  },
  data: function () {
    return {
      page: {
        pageSize: 10,
        currentPage: 1
      }
    }
  },
  methods: {
    handleSizeChange (pSize) {
      this.page.pageSize = pSize
      this.$emit('pageChange', this.page)
    },
    handleCurrentChange (curPage) {
      this.page.currentPage = curPage
      this.$emit('pageChange', this.page)
    }
  }
}
</script>
