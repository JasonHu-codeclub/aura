<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="handleClose"
  >
    <div class="cancel-tips">
      <div class="cancel-title">
        <span
          class="ancel-title-icon"
          :style="{ backgroundImage: 'url(' + iconUrl + ')' }"
        ></span>
        <span class="ancel-title-text">{{ title }}</span>
      </div>
      <div class="cancel-content" v-html="content"></div>
      <div v-if="showInput" class="cancel-reasons">
        <span class="cancel-reasons-label">{{
          $t("tip.ReasonsForRefusal")
        }}</span>
        <el-input
          type="text"
          v-model="reasons"
          :placeholder="$t('placeholder.enterReason')"
          maxlength="30"
          show-word-limit
        ></el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{
        $t("button.cancel")
      }}</el-button>
      <el-button
        type="primary"
        @click="hanldDeleteMeeting"
        :loading="dialogBtnLoading"
        :style="{ background: confirmColor, borderColor: confirmColor }"
        >{{ $t("button.confirm") }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      reasons: "",
    };
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
    showInput: {
      type: Boolean,
      default: false,
    },
    iconUrl: {
      type: String,
      default: require("../../../../assets/icon/warning.png"),
    },
    confirmColor: {
      type: String,
      default: "#FF5B5B",
    },
  },
  computed: {
    //    按钮loaging
    dialogBtnLoading: {
      get() {
        return this.btnLoading;
      },
      set() {},
    },
  },
  mounted() {},
  methods: {
    // 确认
    hanldDeleteMeeting() {
      this.dialogBtnLoading = true;
      this.$emit("hanldConfirm", this.reasons);
    },
    // 取消
    handleClose() {
      this.isShowInput = false;
      this.reasons = "";
      this.$emit("handleClose");
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-dialog__header {
  padding: 0;
}
/dedp/.el-dialog__headerbtn {
  top: 25px;
}
/deep/.el-dialog__header {
  border: none !important;
}
/deep/.el-dialog__body {
  padding: 25px 10px 12px 33px;
  .cancel-tips {
    font-size: 16px;
    color: #43434d;
    .ancel-title-icon {
      display: inline-block;
      width: 26px;
      height: 26px;
      background-size: 100% 100%;
    }
    .cancel-title {
      color: #43434d;
      font-size: 16px;
      display: flex;
      align-items: center;
      .ancel-title-text {
        margin-left: 11px;
      }
    }
    .cancel-content {
      padding-left: 36px;
      margin-top: 12px;
      line-height: 30px;
    }
    .cancel-reasons {
      display: flex;
      justify-content: start;
      align-items: center;
      padding: 0 22px 0 36px;
      margin-top: 12px;
      .cancel-reasons-label {
        width: 82px;
        font-size: 14px;
      }
    }
  }
}
/deep/.el-dialog__footer {
  .el-button--medium {
    padding: 12px 23px !important;
  }

  .el-button + .el-button {
    margin-left: 20px;
  }
  .el-button--primary {
    background-color: #ff5b5b;
    border-color: #ff5b5b;
  }

  .el-button--primary:focus,
  .el-button--primary:hover {
    background: #cc2121;
    border-color: #cc2121;
    color: #fff;
  }
}
</style>