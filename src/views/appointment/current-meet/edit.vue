
/**
  编辑会议
 */
<template>
  <meet-info :data-type="2" />
</template>
<script>
import meetInfo from './components/meet-info'
export default {
  name: 'edit',
  components: { meetInfo }
}
</script>
