/*
 * Created: 2021-02-22 09:39:43
 * Author : Jan
 * Last Modified: 2021-03-02 16:39:56
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

import axios from 'axios'
import { getHost } from './tool'
import { getToken } from './auth'
import store from '../store'
import { Notification, message } from 'element-ui'

// import qs from "qs" 

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : getHost(), // api的基本URL
  // timeout: 5000, // 请求超时时间
  // headers: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置头部格式
  // withCredentials: true // send cookies when cross-domain requests
})

// request拦截器
service.interceptors.request.use(config => {
  // 在发送请求之前进行一些处理
  if (store.getters.token) {
    // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-USER-TOKEN'] = getToken()
  }
  return config
}, error => {
  // 请求错误的处理
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    // 任何在2xx范围的状态码都会触发此功能
    // return response.data
    /* 常规请求 */
    const { data, meta: { code, message } } = response.data
    if (code !== 'RESP_OKAY') {
      // Notification({
      //   title: '提示',
      //   message: message,
      //   type: 'error',
      //   duration: 3 * 1000
      // })
      // message({
      //   message: message,
      //   type: 'error',
      //   duration: 3 * 1000
      // });
      return Promise.reject('error')
    } else {
      if (response.config.method !== 'get') {
        // Notification({
        //   title: '提示',
        //   message: message,
        //   type: 'success',
        //   duration: 3 * 1000
        // })
      }
      return response.data
    }
  },
  error => {
    // Notification({
    //   message: error.response.data.meta.message,
    //   type: 'error',
    //   duration: 3 * 1000
    // })
    message({
      message: error.response.data.meta.message,
      type: 'error',
      duration: 3 * 1000
    });
    // console.log(error.response.data, 'error')
    // return
    // 未经授权,回到登录页
    if (error.response.data.meta.code === 'SECU_0001') {
      return
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    }
    return error.response.data//Promise.reject(error)
  })

export default service
