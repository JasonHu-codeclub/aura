/*
 * Created: 2021-03-01 11:29:52
 * Author : Jan
 * Last Modified: 2021-03-24 11:53:57
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

<template>
  <div>
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <side-bar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import Logo from './Logo'
import variables from '@/styles/variables.less'
import { mapGetters } from 'vuex'
import SideBarItem from './SideBarItem'
export default {
  components: { Logo, SideBarItem },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    variables () {
      return variables
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // 是否折叠
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  watch: {},
  methods: {

  },
  created () {

  },
  mounted () {

  }
}
</script>
<style lang='less' scoped>
</style>