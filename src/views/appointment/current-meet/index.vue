/** 当前会议 */

<template>
  <meeting-template :data-type="1" />
</template>
<script>
import meetingTemplate from "./components/meet-list";
export default {
  name: "CurrentMeet",
  components: { meetingTemplate },
  beforeRouteLeave(to, from, next) {
    // 注销onresizes事件
    window.onresize = null;
    next();
  }
};
</script>
