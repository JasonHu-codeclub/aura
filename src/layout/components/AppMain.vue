/* * Created: 2021-03-01 11:10:52 * Author : Jan * Last Modified: 2021-03-09 11:36:32 * Modified By:
Jan * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved. */

<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>
<script>
export default {
  name: "AppMain",
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #eaedf6;
}
// .fixed-header + .app-main {
//   padding-top: 50px;
// }
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>
