
/**
  当前会议
 */

 
<template>
  <meeting-template :data-type="1" />
</template>
<script>
import meetingTemplate from './components/meet-list'
export default {
  name: 'current',
  components: { meetingTemplate }
}
</script>


