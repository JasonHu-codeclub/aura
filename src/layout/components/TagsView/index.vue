/* * Created: 2021-03-01 11:31:10 * Author : Jan * Last Modified: 2021-03-17 10:07:48 * Modified By:
Jan * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved. */

<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ generateTitle(tag.title) }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <!-- 自定义右键菜单 -->
    <!-- <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        关闭
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul> -->
    <!-- 切换弹窗 -->
    <!-- <dialog-page-close ref="dialogPage" @confirmHandling="saveHanld" @cancelHandling="closeTags" /> -->
  </div>
</template>
<script>
import { generateTitle } from "@/utils/i18n";
import ScrollPane from "./ScrollPane";
import path from "path";
import dialogPageClose from "@/components/dialogPageClose";
import bus from "@/utils/bus";
export default {
  components: { ScrollPane, dialogPageClose },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    routes() {
      return this.$store.state.permission.routes;
    }
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted() {
    // bus.$on("closeTagHanld", this.closeTags);
    // 页面刷新前缓存和赋值
    this.beforeUnload();
    this.initTags();
    this.addTags();
  },
  methods: {
    generateTitle,
    beforeUnload() {
      // 监听页面刷新
      window.addEventListener("beforeunload", () => {
        // 转换tabViews数据
        const tabViews = this.visitedViews.map(item => {
          return {
            fullPath: item.fullPath,
            hash: item.hash,
            meta: { ...item.meta },
            name: item.name,
            params: { ...item.params },
            path: item.path,
            query: { ...item.query },
            title: item.title
          };
        });
        sessionStorage.setItem("tabViews", JSON.stringify(tabViews));
      });
      // 页面初始化加载判断缓存中是否有数据
      const oldViews = JSON.parse(sessionStorage.getItem("tabViews")) || [];
      if (oldViews.length > 0) {
        this.$store.state.tagsView.visitedViews = oldViews;
        // 赋值后清除数据
        sessionStorage.clear();
      }
    },
    isActive(route) {
      return route.path === this.$route.path;
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix;
    },
    filterAffixTags(routes, basePath = "/") {
      let tags = [];
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch("tagsView/addVisitedView", tag);
        }
      }
    },
    addTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("tagsView/addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("tagsView/updateVisitedView", this.$route);
            }
            break;
          }
        }
      });
    },
    // 刷新当前tag下的页面
    refreshSelectedTag(view) {
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        const { fullPath } = view;
        console.log("view", view);
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath
          });
        });
      });
    },
    // 关闭当前tag的页面
    closeSelectedTag(view) {
      // let view = this.viewData;
      // this.$refs.dialogPage.dialogVisibleLive = false;
      this.$store.dispatch("tagsView/setCloseTagView", true); // 标记关闭方式
      this.$store.dispatch("tagsView/delView", view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view);
        }
      });
    },

    // 关闭当前tag的页面
    // closeSelectedTag(view) {
    //   this.viewData = view;
    //   this.closeTags();
    //   // if (view.name == "Edit") {
    //   //   this.$refs.dialogPage.dialogVisibleLive = true;
    //   // } else {
    //   //   this.closeTags();
    //   // }
    // },
    // // 离开前保存
    // // saveHanld() {
    // //   bus.$emit("saveInfo", "closeTag");
    // // },
    // // 关闭当前tag的页面
    // closeTags() {
    //   let view = this.viewData;
    //   this.$refs.dialogPage.dialogVisibleLive = false;
    //   this.$store.dispatch("tagsView/setCloseTagView", true); // 标记关闭方式
    //   this.$store.dispatch("tagsView/delView", view).then(({ visitedViews }) => {
    //     if (this.isActive(view)) {
    //       this.toLastView(visitedViews, view);
    //     }
    //   });
    // },

    // 关闭其他页面
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store.dispatch("tagsView/delOthersViews", this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    // 关闭所有
    closeAllTags(view) {
      this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    // 跳转到上一个tag的页面
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "Dashboard") {
          // to reload home page
          this.$router.replace({ path: "/redirect" + view.fullPath });
        } else {
          this.$router.push("/");
        }
      }
    },
    // 右键鼠标事件-打开菜单
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    handleScroll() {
      this.closeMenu();
    }
  },
  beforeDestroy() {
    //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
    // bus.$off("closeTagHanld");
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/variables.less";
.tags-view-container {
  height: 40px;
  margin-left: 20px;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 5px 12px;
      font-size: 16px;
      margin-left: 7px;
      border-radius: 4px;
      box-sizing: content-box;
      &:first-of-type {
        margin-left: 20px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: @btnActiveBg;
        color: #fff;
        border-color: @btnActiveBg;
        // &::before {
        //   content: "";
        //   background: #fff;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 2px;
        // }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="less">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
