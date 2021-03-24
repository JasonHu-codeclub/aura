/*
 * Created: 2021-03-24 09:47:46
 * Author : Jan
 * Last Modified: 2021-03-24 10:09:04
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

import Layout from '@/layout'

const appointment = {
  path: '/appointment',
  component: Layout,
  redirect: '/appointment/appoint',
  name: 'Appoint',
  meta: {
    title: '会易订',
    icon: 'username'
  },
  children: [
    {
      path: 'appoint',
      component: () => import('@views/appointment/appoint'),
      name: 'Appoint',
      meta: {
        title: '预约会议'
      }
    },
    {
      path: 'current',
      component: () => import('@views/appointment/current-meet'),
      name: 'CurrentMeet',
      meta: {
        title: '当前会议'
      }
    },
    {
      path: 'history',
      component: () => import('@views/appointment/history-record'),
      name: 'HistoryRecord',
      meta: {
        title: '历史记录'
      }
    },
    {
      path: 'approve',
      component: () => import('@views/appointment/approve'),
      name: 'Approve',
      meta: {
        title: '审批'
      }
    },
    {
      path: 'service',
      component: () => import('@views/appointment/service'),
      name: 'Service',
      meta: {
        title: '会服'
      }
    }
  ]
}

export default appointment