<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <i class="icon iconfont" :class="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" />
          <span>&nbsp;{{ generateTitle(onlyOneChild.meta.title) }}</span>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <i v-if="item.meta" class="icon iconfont" :class="item.meta && item.meta.icon" />
        <span>&nbsp;{{ generateTitle(item.meta.title) }}</span>
      </template>
      <side-bar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import { generateTitle } from '@/utils/i18n'
import Item from './Item'
import AppLink from './Link'
// import FixiOSBug from './FixiOSBug'

export default {
  name: 'SideBarItem',
  components: { Item, AppLink },
  // mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
    generateTitle
  }
}
</script>
<style lang="less" scoped>
.submenu-title-noDropdown>.iconfont, .el-submenu__title>.iconfont{
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 16px;
  }

  .appo{
    background: url('../../../assets/icon/appo.png') no-repeat;
    background-size: contain;
  }
  .is-active .appo{
    background: url('../../../assets/icon/appo-active.png') no-repeat;
    background-size: contain;
  }
  .current{
    background: url('../../../assets/icon/current_1.png') no-repeat;
    background-size: contain;
  }
  .is-active .current{
    background: url('../../../assets/icon/current-active_1.png') no-repeat;
    background-size: contain;
  }
  .overview{
    background: url('../../../assets/icon/overview.png') no-repeat;
    background-size: contain;
  }
  .is-active .overview{
    background: url('../../../assets/icon/overview-active.png') no-repeat;
    background-size: contain;
  }
  .history{
    background: url('../../../assets/icon/history_1.png') no-repeat;
    background-size: contain;
  }
  .is-active .history{
    background: url('../../../assets/icon/history-active_1.png') no-repeat;
    background-size: contain;
  }
  .approve{
    background: url('../../../assets/icon/approve.png') no-repeat;
    background-size: contain;
  }
  .is-active .approve{
    background: url('../../../assets/icon/approve-active.png') no-repeat;
    background-size: contain;
  }
  .service{
    background: url('../../../assets/icon/service.png') no-repeat;
    background-size: contain;
  }
  .is-active .service{
    background: url('../../../assets/icon/service-active.png') no-repeat;
    background-size: contain;
  }
  

</style>