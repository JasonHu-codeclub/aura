/**
  历史记录
 */

<template>
  <meeting-template :data-type="2" />
</template>
<script>
import meetingTemplate from '../current-meet/components/meet-list'
export default {
  name: 'historyRecord',
  components: { meetingTemplate }
}
</script>
