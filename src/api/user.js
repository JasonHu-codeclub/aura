/*
 * Created: 2021-02-23 11:50:39
 * Author : Jan
 * Last Modified: 2021-03-24 11:19:53
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */
import request from "@utils/request.js"


// 登录
export function loginApi(data) {
  return request({
    url: "/auth/sign-in",
    method: "post",
    headers: { 'X-USER-TOKEN': '8ISrMLiQiPS6fqEculxFwJjcMMtIjvbDTblLoRSaAZlTF3Mf8jmSFKS2wqa8tU7KvZPuTzAhDan3FiVqNNrSbCvfWmRRKmAguE84rF7G1wK2pztasFQYVHEEXdEz3jsF' },
    data
  })
}


// 获取系统前台信息
export function getSystemInfoApi(data) {
  return request({
    url: "/get-front-system-info",
    method: "get",
    headers: { 'X-USER-TOKEN': '8ISrMLiQiPS6fqEculxFwJjcMMtIjvbDTblLoRSaAZlTF3Mf8jmSFKS2wqa8tU7KvZPuTzAhDan3FiVqNNrSbCvfWmRRKmAguE84rF7G1wK2pztasFQYVHEEXdEz3jsF' },
    params: data
  })
}

// 获取用户信息
export function qyWechatLoginApi(data) {
  return request({
    url: "/wechat/login",
    method: "get",
    params: data
  })
}

// 登出
export function logoutApi(data) {
  return request({
    url: "/auth/sign-out",
    method: "post",
    data
  })
}


// 获取用户信息
export function getInfoApi(data) {
  return request({
    url: "/user/get-me",
    method: "get",
    params: data || {}
  })
}

// 获取是否已经登录凭证
export function getCodeApi(data) {
  return request({
    url: "/user/get_code",
    method: "get",
    params: data || {}
  })
}

// 确认密码
export function resetPassApi(data) {
  return request({
    url: "/personal-center/password",
    method: "put",
    data
  })
}

// 个人中心修改
export function serviceCenterApi(data, id) {
  return request({
    url: "/personal-center/" + id,
    method: "post",
    data
  })
}



// 微信扫码授权code登录
export function authAppletLoginApi(data) {
  return request({
    url: "/auth/open_platform/login",
    method: "post",
    data,
    headers: { 'X-USER-TOKEN': '8ISrMLiQiPS6fqEculxFwJjcMMtIjvbDTblLoRSaAZlTF3Mf8jmSFKS2wqa8tU7KvZPuTzAhDan3FiVqNNrSbCvfWmRRKmAguE84rF7G1wK2pztasFQYVHEEXdEz3jsF' },
  })
}





// 微信开放平台登录-发送验证码
export function authOpenPlatformCodeApi(data) {
  return request({
    url: "/auth/open_platform/code",
    method: "post",
    data,
    headers: { 'X-USER-TOKEN': '8ISrMLiQiPS6fqEculxFwJjcMMtIjvbDTblLoRSaAZlTF3Mf8jmSFKS2wqa8tU7KvZPuTzAhDan3FiVqNNrSbCvfWmRRKmAguE84rF7G1wK2pztasFQYVHEEXdEz3jsF' },
  })
}





// 微信开房平台登录-短信验证登录
export function authOpenPlatformValidationLoginApi(data) {
  return request({
    url: "/auth/open_platform/validation/login",
    method: "post",
    data,
    headers: { 'X-USER-TOKEN': '8ISrMLiQiPS6fqEculxFwJjcMMtIjvbDTblLoRSaAZlTF3Mf8jmSFKS2wqa8tU7KvZPuTzAhDan3FiVqNNrSbCvfWmRRKmAguE84rF7G1wK2pztasFQYVHEEXdEz3jsF' },
  })
}





// 小程序邀请码
export function getAuthInviteSmallProgramCodeApi(data) {
  return request({
    url: "/auth/invite/small_program_code",
    method: "get",
    params: data || {},
    headers: { 'X-USER-TOKEN': '8ISrMLiQiPS6fqEculxFwJjcMMtIjvbDTblLoRSaAZlTF3Mf8jmSFKS2wqa8tU7KvZPuTzAhDan3FiVqNNrSbCvfWmRRKmAguE84rF7G1wK2pztasFQYVHEEXdEz3jsF' },

  })
}