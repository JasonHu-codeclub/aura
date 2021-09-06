/** 编辑会议 */
<template>
  <div>
    <meet-info
      ref="meetInfo"
      :data-type="2"
      @saveInfo="saveInfoLeave"
      @changeIsSave="IsSaveHanld"
    />
    <!-- 离开页面提示 -->
    <dialog-page-close
      ref="dialogPage"
      @confirmHandling="confirmToPage"
      @cancelHandling="cancelHanld"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import meetInfo from "./components/meet-info";
import dialogPageClose from "@/components/dialogPageClose";
export default {
  name: "Edit",
  data() {
    return {
      falg: false, // 是否允许跳转
      isSave: false, // 保存跳转
      targetPath: "" // 目标页面
    };
  },
  components: { meetInfo, dialogPageClose },
  computed: {
    ...mapGetters(["isCloseTag", "isCloseTagSave"])
  },
  methods: {
    //确认跳转目标页面
    confirmToPage() {
      this.$refs.meetInfo.saveForm();
      // this.$router.push(this.targetPath.fullPath)
    },
    // 离开编辑页
    cancelHanld() {
      this.falg = true;
      this.$refs.dialogPage.dialogVisibleLive = false;
      this.$router.push(this.targetPath.fullPath);
    },
    // 保存后离开编辑页
    saveInfoLeave() {
      this.falg = true;
      this.$refs.dialogPage.dialogVisibleLive = false;
      this.$router.push(this.targetPath.fullPath);
    },
    // 改变跳转方式
    IsSaveHanld(data) {
      this.isSave = data;
    }
  },

  // 离开此页面前
  beforeRouteLeave(to, form, next) {
    if (this.isSave) {
      next();
      return;
    }
    let isCloseTag = this.isCloseTag;
    if (!isCloseTag) {
      this.$refs.dialogPage.dialogVisibleLive = true;
    } else {
      this.falg = isCloseTag;
    }
    this.targetPath = to;
    if (this.falg) {
      this.$store.dispatch("tagsView/setCloseTagView", false);
      this.$refs.dialogPage.dialogVisibleLive = false;
      next();
    }
  }
};
</script>
