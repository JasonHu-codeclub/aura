
/**
  审批详情
 */
<template>
  <meet-info :data-type="3" />
</template>
<script>
import meetInfo from '@/views/appointment/current-meet/components/meet-info'
export default {
  name: 'detailsInfo',
  components: { meetInfo }
}
</script>

