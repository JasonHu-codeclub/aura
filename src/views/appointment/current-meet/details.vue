/** 会议详情 */
<template>
  <meet-info :data-type="1" />
</template>
<script>
import meetInfo from "./components/meet-info";
var activeMenuList = {
  current: "/current/current_list",
  history: "/history/history_list",
  conflict: "/approve/approve_list",
  services: "/service/service_list"
};
export default {
  name: "Details",
  components: { meetInfo },
  beforeRouteEnter(to, from, next) {
    // 当前激活菜单
    let query = to.query;
    let menuStr = query.menu;
    to.meta.activeMenu = activeMenuList[menuStr];
    next();
  }
};
</script>
