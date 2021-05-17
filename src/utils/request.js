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
// import qs from "qs" 

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : getHost(), // api的基本URL
  // timeout: 5000, // 请求超时时间
  headers: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置头部格式
  // withCredentials: true // send cookies when cross-domain requests
})

// request拦截器
service.interceptors.request.use(config => {
  // 在发送请求之前进行一些处理
  if (store.getters.token) {
    // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-Token'] = getToken()
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
    return response.data
  },
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  error => {
    // 任何超出2xx范围的状态码都会触发此功能
    console.log('err' + error)// for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  })

export default service
