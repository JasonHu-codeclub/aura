/*
 * Created: 2021-03-02 09:17:38
 * Author : Jan
 * Last Modified: 2021-03-16 16:50:31
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

/**
 * 处理页面跳转的鉴权行为,设置全局路由守卫
 */
import router from './router'
import store from './store'
import { getToken } from './utils/auth'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/page-title'
(async function (){
  // 动态设置favicon.ico
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      let icoUrl = await store.dispatch('user/icoSetting')
      link.href = icoUrl
      document.getElementsByTagName('head')[0].appendChild(link);
})()
// 白名单,不需要登录的路由路径
const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  // 进度条开始
  NProgress.start()
  // 动态设置标签页的title
  document.title = getPageTitle(to.meta.title)
  // 1.获得已经登录的包含用户信息的标识
  const hasToken = getToken()
  // 2.判断登录情况
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 2.1 判断当前用户的权限是否已生成
      const hasRoles = store.getters.roles 
      if (hasRoles) {
        next()
      } else {
        try {
          await store.dispatch('user/getSystemInfo')
          const roles  = await store.dispatch('user/getInfo')
          // 筛选后有权限的路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 动态生成路由
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单内,可以直接访问
      next()
    } else {
      // 其他没有权限的跳转到登录页,并带上回调路径
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 结束进度
  NProgress.done()
})