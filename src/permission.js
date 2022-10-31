/**
 * 处理页面跳转的鉴权行为,设置全局路由守卫
 */
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import getPageTitle from '@/utils/page-title'
import { message } from '@/utils/resetMessage';
import { getToken, setToken } from './utils/auth'
import { getHost } from './utils/tool'
import i18n from './lang'
import 'nprogress/nprogress.css' // progress bar style

// 白名单,不需要登录的路由路径
const whiteList = ['/login','/message']
router.beforeEach(async (to, from, next) => {
  // 进度条开始
  NProgress.start()
  // 动态设置标签页的title
  document.title = getPageTitle(i18n.t(to.meta.title))
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
      const permissions = store.getters.permissions
      if (hasRoles) {
        // 判断当前页面是否有权限
        if (to.path == '/404') {
          const isPermission = await store.dispatch('permission/isPermission', { roles: permissions, path: to.redirectedFrom })
          if (!isPermission) {
            message({
              message: i18n.t('message.roleChanged'),
              type: 'error',
              duration: 3 * 1000
            });
            // 删除tab按钮
            store.dispatch("tagsView/delView", { path: to.redirectedFrom })
            next({ path: '/home' })
            NProgress.done();
          } else {
            next()
          }
        } else {
          next()
        }
      } else {
        try {
          await store.dispatch('user/getSystemInfo')
          const roles = await store.dispatch('user/getInfo')
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
    // store.getters.isAutoLogin
    if (store.getters.isAutoLogin) {
      console.log('自动登录')
      // 初次进入,无token

      if (!getQueryString('token') && !router.currentRoute.query.token) {
        window.location.href = getHost() + '/sp-home/'
        return
      }

      if (getQueryString('token')) {
        let code = getQueryString('token')
        setToken(code)
        await store.dispatch('user/setInitToken', code)
        setTimeout(async () => {
          try {
            // 2.1 判断当前用户的权限是否已生成
            const hasRoles = store.getters.roles
            const permissions = store.getters.permissions
            if (hasRoles) {
              // 判断当前页面是否有权限
              if (to.path == '/404') {
                const isPermission = await store.dispatch('permission/isPermission', { roles: permissions, path: to.redirectedFrom })
                if (!isPermission) {
                  message({
                    message: i18n.t('message.roleChanged'),
                    type: 'error',
                    duration: 3 * 1000
                  });
                  // 删除tab按钮
                  store.dispatch("tagsView/delView", { path: to.redirectedFrom })
                  next({ path: '/home' })
                  NProgress.done();
                } else {
                  next()
                }
              } else {
                next()
              }
            } else {
              try {
                await store.dispatch('user/getSystemInfo')
                const roles = await store.dispatch('user/getInfo')
                // 筛选后有权限的路由表
                const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                // 动态生成路由
                router.addRoutes(accessRoutes)
                next({ path: '/home' })
              } catch (error) {
                await store.dispatch('user/resetToken')
                // Message.error(error || 'Has Error')
                next(`/login?redirect=${to.path}`)
                NProgress.done()
              }
            }

          } catch (error) {
            await store.dispatch('user/resetToken')
            NProgress.done()
          }
        }, 500)

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

  }
})

router.afterEach(() => {
  // 结束进度
  NProgress.done()
})


function getQueryString(key) {
  //key存在先通过search取值如果取不到就通过hash来取
  var after = window.location.hash
  //如果url中没有传参直接返回空
  if (after.indexOf('?') === -1) return null;
  var param = after.split("?")[1];
  if (param) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = param.match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    else {
      return null;
    }
  }
}
