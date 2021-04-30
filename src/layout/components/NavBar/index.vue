/*
 * Created: 2021-03-01 11:22:15
 * Author : Jan
 * Last Modified: 2021-03-24 10:14:00
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

<template>
  <div class="navbar">
    <!-- 汉堡包-折叠按钮 -->
    <!-- <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    /> -->
    <!-- 面包屑 -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <!-- 标题 -->
    <div class="right-left">会议预约系统</div>
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->
      </template>
      <!-- 头像,名称 -->
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <span class="user-name">{{ name }}</span>
          <span class="user-avatar" :style="{backgroundImage: 'url('+ avatar +')'}"></span>
          <!-- <img :src="avatar" class="user-avatar" /> -->
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link> 
          <router-link to="/">
            <el-dropdown-item>回到首页</el-dropdown-item>
          </router-link>-->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="division"></span>
      <!-- 全屏按钮 -->
      <screenfull id="screenfull" class="right-menu-item hover-effect" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './components/BreadCrumb'
import Hamburger from './components/Hamburger'
import Screenfull from './components/Screenfull'
// import Search from './components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    // Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name'
    ])
  },
  methods: {
    // 切换侧边栏展开/缩起
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  height: 54px;
  line-height: 54px;
  overflow: hidden;
  position: relative;
  color: #fff;
  background: #3a3b4c;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .right-left{
    float: left;
    font-size: 18px;
    line-height: 54px;
    font-weight: 600;
    margin-left: 44px;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    align-items: center;
    float: right;
    height: 100%;
    line-height: 50px;
    padding: 0 14px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      font-size: 14px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .language{
      width: 86px;
      color: #fff;
      margin-right: 10px;
      cursor: pointer;
    }

    .division{
      width: 1px;
      background: #979797;
      display: inline-block;
      height: 20px;
      margin: 0 18px;
    }

    .avatar-container {
      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: flex-start;

        .user-name {
          font-size: 14px;
          color: #FFFFFF;
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          margin-top: 5px;
          border-radius: 20px;
          margin-left: 18px;
          background-color: #dddddd;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
