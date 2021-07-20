/*
 * Created: 2021-03-12 14:18:53
 * Author : Jan
 * Last Modified: 2021-03-25 16:36:07
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

import defaultSettings from '@/settings'
import store from '../store'
export default function getPageTitle(pageTitle) {
  let title = store.getters.companyName || defaultSettings.title
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}