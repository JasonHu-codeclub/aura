/*
 * Created: 2021-03-12 14:18:53
 * Author : Jan
 * Last Modified: 2021-03-25 16:36:07
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

import defaultSettings from '@/settings'

const title = defaultSettings.title || ''

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}