
/**
  当前会议
 */

 
<template>
  <meeting-template :data-type="1" />
</template>
<script>
import meetingTemplate from './meetingTemplate'
export default {
  name: 'EntityAdd',
  components: { meetingTemplate }
}
</script>


