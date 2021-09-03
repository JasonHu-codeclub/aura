<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 侧边栏 -->
    <side-bar class="sidebar-container" />
    <!-- 主体 -->
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <!-- 头部导航 -->
      <div :class="{ 'fixed-header': fixedHeader }">
        <nav-bar />
        <tags-view v-if="needTagsView" />
      </div>
      <!-- 内容主体 -->
      <app-main />
      <!-- <right-panel v-if="showSettings">
        <settings />
      </right-panel> -->
    </div>
  </div>
</template>
<script>
import { AppMain, NavBar, SideBar, TagsView } from "./components";
import { mapState } from "vuex";
export default {
  components: { AppMain, NavBar, SideBar, TagsView },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  watch: {},
  methods: {},
  created() {}
};
</script>
<style lang="less" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  background-color: #eaedf6;
  .main-container {
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: 210px;
    position: relative;
  }
  .sidebar-container {
    transition: width 0.28s;
    width: 210px !important;
    background-color: #ffffff;
    height: 100%;
    position: absolute;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }
}
</style>
