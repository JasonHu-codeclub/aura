
/**
  审批详情
 */
<template>
  <meet-info :data-type="1" />
</template>
<script>
import meetInfo from '@/views/appointment/current-meet/components/meet-info'
export default {
  name: 'detailsInfo',
  components: { meetInfo }
}
</script>

