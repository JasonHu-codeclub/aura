/*
 * Created: 2021-03-24 10:23:34
 * Author : Jan
 * Last Modified: 2021-03-24 10:33:23
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

import Layout from '@/layout'

const visit = {
  path: '/visit',
  component: Layout,
  redirect: '/visit/visitor_list',
  name: 'Visit',
  meta: {
    title: '访客通',
    icon: 'username'
  },
  children: [
    {
      path: 'visitor_list',
      component: () => import('@views/visit/visitor-list'),
      name: 'VisitorList',
      meta: {
        title: '访客列表'
      }
    },
    {
      path: 'parking_record',
      component: () => import('@views/visit/parking-record'),
      name: 'ParkingRecord',
      meta: {
        title: '停车记录'
      }
    },
  ]
}

export default visit