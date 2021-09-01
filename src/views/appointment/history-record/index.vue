/** 历史记录 */

<template>
  <meeting-template :data-type="2" />
</template>
<script>
import meetingTemplate from "../current-meet/components/meet-list";
export default {
  name: "HistoryRecord",
  components: { meetingTemplate },
  beforeDestroy() {
    // 注销onresizes事件
    window.onresize = null;
  }
};
</script>
