/* * Created: 2021-03-01 11:30:22 * Author : Jan * Last Modified: 2021-03-24 10:36:22 * Modified By:
Jan * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved. */

<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <!-- <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/"> -->
      <div v-if="collapse" class="sidebar-logo-link" @click="goToHome()">
        <img v-if="logo" :src="logo + '?time=' + new Date().getTime()" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </div>
      <!-- </router-link> -->
      <!-- <router-link v-else key="expand" class="sidebar-logo-link" to="/"> -->
      <div v-else class="sidebar-logo-link" @click="goToHome()">
        <img
          v-if="systemLogo"
          :src="baseURL + systemLogo  + '?time=' + new Date().getTime()"
          class="sidebar-logo"
        />
      </div>
      <!-- <h1 class="sidebar-title">{{ systemName }}</h1> -->
      <!-- </router-link> -->
    </transition>
  </div>
</template>
<script>
const defaultSettings = require("@/settings.js");
import { imgBaseUrl } from "@/utils/varible";
import { mapGetters } from "vuex";
export default {
  components: {},
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      baseURL: imgBaseUrl,
      title: defaultSettings.title,
      // logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
      logo: require("@/assets/logo.png"),
    };
  },
  computed: {
    ...mapGetters(["systemLogo"]),
  },
  watch: {},
  methods: {
    goToHome() {
      let host = null;
      let url = window.location.href;
      const regex = /(\w+):\/\/([^/:]+)(:\d*)?/;
      const match = url.match(regex);
      if (typeof match !== "undefined" && match !== null) {
        host = match[0];
      }
      window.location.href = host + "/sp-home/";
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 54px;
  line-height: 50px;
  background-color: #3a3b4c;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    display: flex !important;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 10px 6px 10px 32px;
    & .sidebar-logo {
      height: 100%;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
