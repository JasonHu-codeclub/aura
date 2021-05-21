/*
 * Created: 2021-03-24 09:42:28
 * Author : Jan
 * Last Modified: 2021-03-24 10:39:19
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

/**
  历史记录
 */

<template>
  <meeting-template :data-type="2" />
</template>
<script>
import meetingTemplate from '../current-meet/meetingTemplate'
export default {
  name: 'historyRecord',
  components: { meetingTemplate }
}
</script>
