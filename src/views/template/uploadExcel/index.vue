/*
 * Created: 2021-03-11 16:32:05
 * Author : Jan
 * Last Modified: 2021-03-11 17:09:39
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="filter-item" @click="showDialog"
        >上传表格</el-button
      >
    </div>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        v-for="item of tableHeader"
        :key="item"
        :prop="item"
        :label="item"
      />
    </el-table>

    <el-dialog title="上传表格" :visible.sync="dialogIsShow">
      <Upload :on-success="handleSuccess" :before-upload="beforeUpload" />
    </el-dialog>
  </div>
</template>
<script>
import Upload from './components/Upload'
export default {
  components: { Upload },
  data () {
    return {
      tableData: [],
      tableHeader: [],
      dialogIsShow: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    showDialog () {
      this.dialogIsShow = true
    },
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess ({ results, header }) {
      this.$notify({
        title: '成功',
        message: '上传表格成功!',
        type: 'success',
        duration: 2000
      });

      this.tableData = results
      this.tableHeader = header
      this.dialogIsShow = false
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style lang='less' scoped>
</style>