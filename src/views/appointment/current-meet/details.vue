/** 会议详情 */
<template>
  <meet-info :data-type="1" />
</template>
<script>
import meetInfo from "./components/meet-info";
export default {
  name: "Details",
  components: { meetInfo }
};
</script>
