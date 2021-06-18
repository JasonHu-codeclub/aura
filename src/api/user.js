/*
 * Created: 2021-02-23 11:50:39
 * Author : Jan
 * Last Modified: 2021-03-24 11:19:53
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */
import request from "@utils/request.js"


// 登录
export function loginApi (data) {
  return request({
    url: "/auth/sign-in",
    method: "post",
    headers: { 'X-USER-TOKEN': '8ISrMLiQiPS6fqEculxFwJjcMMtIjvbDTblLoRSaAZlTF3Mf8jmSFKS2wqa8tU7KvZPuTzAhDan3FiVqNNrSbCvfWmRRKmAguE84rF7G1wK2pztasFQYVHEEXdEz3jsF' },
    data
  })
}
// 登出
export function logoutApi (data) {
  return request({
    url: "/auth/sign-out",
    method: "post",
    data
  })
}

// 获取用户信息
export function getInfoApi (data) {
  return request({
    url: "/user/get-me",
    method: "get",
    params: data || {}
  })
}

// 获取是否已经登录凭证
export function getCodeApi (data) {
  return request({
    url: "/user/get_code",
    method: "get",
    params: data || {}
  })
}

// 修改密码
export function resetPassReq (data) {
  return request({
    url: "/user/changepassword/",
    method: "post",
    data
  })
}

// export const sendCodeReq = function (data) {
//   return ajax(`${baseURL}/user/get_code`, data)
// }