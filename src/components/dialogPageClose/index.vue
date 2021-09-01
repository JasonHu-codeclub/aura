<template>
  <div class="dialog-page">
    <el-dialog
      :title="$t('tip.leave')"
      :visible.sync="dialogVisibleLive"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="420px"
    >
      <div class="close-tips">
        <div class="close-tips-title">{{ $t("message.LeaveCurrentPage") }}</div>
        <!-- <div >{{$t('message.changesConfirm')}}</div> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelHanld">{{ $t("button.leave") }}</el-button>
        <el-button type="primary" @click="toPageHanld">{{ $t("button.save") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisibleLive: false
    };
  },
  methods: {
    toPageHanld() {
      this.$emit("confirmHandling");
    },
    cancelHanld() {
      this.$emit("cancelHandling");
    }
  }
};
</script>

<style lang="less" scope>
.dialog-page {
  .el-dialog__body {
    padding: 16px 20px !important;
  }
  .el-dialog__footer {
    text-align: right;
  }
  .dialog-footer .el-button {
    height: auto !important;
  }
  // 关闭页面提示弹窗
  .close-tips {
    font-size: 13px;
  }

  .close-tips-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
}
</style>
