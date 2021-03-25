/*
 * Created: 2021-03-24 13:56:13
 * Author : Jan
 * Last Modified: 2021-03-24 13:57:22
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

import request from "@utils/request.js"

// 获取页头标签名/项目名
export function getPageTitleApi (data) {
  return request({
    url: "/page-title",
    method: "get",
    params: { data }
  })
}