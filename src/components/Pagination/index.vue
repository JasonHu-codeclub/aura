/*
 * Created: 2021-03-12 09:48:10
 * Author : Jan
 * Last Modified: 2021-03-12 10:17:27
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    // 数据总数
    total: {
      required: true,
      type: Number
    },
    // 当前页
    page: {
      type: Number,
      default: 1
    },
    // 每页多少数
    limit: {
      type: Number,
      default: 20
    },
    // 页数可选
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 30, 50]
      }
    },
    // 功能选择
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    // 背景
    background: {
      type: Boolean,
      default: true
    },
    // 是否自动滚动
    autoScroll: {
      type: Boolean,
      default: true
    },
    // 是否隐藏
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get () {
        return this.page
      },
      set (val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get () {
        return this.limit
      },
      set (val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    // 控制每页数,回调
    handleSizeChange (val) {
      this.$emit('change', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    // 控制当前页数,回调
    handleCurrentChange (val) {
      this.$emit('change', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
