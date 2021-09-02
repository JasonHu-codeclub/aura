/** 历史记录 */

<template>
  <meeting-template :data-type="2" />
</template>
<script>
import meetingTemplate from "../current-meet/components/meet-list";
export default {
  name: "HistoryRecord",
  components: { meetingTemplate },
  beforeRouteLeave(to, from, next) {
    // 注销onresizes事件
    window.onresize = null;
    next();
  }
};
</script>
