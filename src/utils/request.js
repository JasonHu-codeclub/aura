
import axios from 'axios'
import { getHost } from './tool'
import { getToken } from './auth'
import Cookies from 'js-cookie'
import store from '../store'
import { Notification } from 'element-ui'
import {
  message
} from '@/utils/resetMessage';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : getHost() + '/api', // api的基本URL
  // baseURL: process.env.VUE_APP_BASE_API, // api的基本URL
  // timeout: 5000, // 请求超时时间
  headers: { 'LANG':Cookies.get('language') ||'zh_CN'  },
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
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    let msg = error.response.data ? error.response.data.meta.message : error.response.statusText
    message({
      message: msg,
      type: 'error',
      duration: 3 * 1000
    });
    // 未经授权,回到登录页
    if (error.response.data&&error.response.data.meta.code === 'SECU_0001') {
      
      return
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    }
    return error.response.data//Promise.reject(error)
  })

export default service
