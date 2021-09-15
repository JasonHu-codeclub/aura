import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layout'
import appointment from './modules/appointment'
import visit from './modules/visit'

Vue.use(VueRouter);

//  解决vue-router升级引起的promise报错问题
const originalPush = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location) //.catch(err => err)
}

// 固定显示的路由表
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  // 登录
  {
    path: '/login',
    component: () => import('@views/login'),
    name: 'Login',
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    children: [{
      path: 'index',
      component: () => import('@views/profile'),
      name: 'Profile',
      meta: {
        title: '个人中心',
      },
      hidden: true
    }]
  },
  {
    path: '/404',
    component: () => import('@views/error-page/404'),
    hidden: true
  }]

// 动态显示的路由表
export const asyncRoutes = [
  // 预约页面
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      component: () => import('@views/appointment/appoint'),
      name: 'Home',
      meta: {
        title: 'route.home',
        icon: 'appo',
        affix: true,
        keepAlive: true
      }
    }]
  },
  {
    path: '/current',
    component: Layout,
    redirect: '/current/current_list',
    children: [{
        path: 'current_list',
        component: () => import('@views/appointment/current-meet'),
        name: 'CurrentMeet',
        meta: {
          title: 'route.current',
          icon: 'current',
          affix: false,
          keepAlive: true
        }
      },
      // 重复会议列表
      {
          path: 'repeat',
          component: () => import('@views/appointment/current-meet/repeat'),
          name: 'Repeat',
          hidden: true,
          meta: {
            title: 'route.repeatMeet',
            affix: false,
            activeMenu: '/current/current_list',
            keepAlive: true
          }
      },
      // 编辑
      {
          path: 'edit',
          component: () => import('@views/appointment/current-meet/edit'),
          name: 'Edit',
          hidden: true,
          meta: {
            title: 'route.editMeet',
            affix: false,
            activeMenu: '/current/current_list',
            keepAlive: true
          }
      },
    ]
  },
  // 详情
  {
    path: '/details',
    component: Layout,
    redirect: '/details/info',
    children: [{
      path: 'info',
      component: () => import('@views/appointment/current-meet/details'),
      name: 'Details',
      meta: {
        title: 'route.detailsMeet',
        affix: false,
        activeMenu: '',
        keepAlive: false
      },
      hidden: true
    }]
  },
  // 历史会议
  {
    path: '/history',
    component: Layout,
    redirect: '/history/history_list',
    children: [{
      path: 'history_list',
      component: () => import('@views/appointment/history-record'),
      name: 'HistoryRecord',
      meta: {
        title: 'route.history',
        icon: 'history',
        affix: false,
        keepAlive: true,
        noCache: false
      }
    }]
  },
  // 数据概览
  {
    path: '/overview',
    component: Layout,
    redirect: '/overview/index',
    children: [{
      path: 'index',
      component: () => import('@views/appointment/overview'),
      name: 'overview',
      meta: {
        title: 'route.overview',
        icon: 'overview',
        affix: false,
        keepAlive: false,
        noCache: false
      }
    }]
  },
  // 审批管理
  {
    path: '/approve',
    component: Layout,
    redirect: '/approve/approve_list',
    children: [{
      path: 'approve_list',
      component: () => import('@views/appointment/approve'),
      name: 'Approve',
      meta: {
        title: 'route.Approve',
        icon: 'approve',
        affix: false,
        role: 'is_belong_approve', // 权限
        keepAlive: true
      }
    },
    // 冲突
    {
      path: 'conflict',
      component: () => import('@views/appointment/approve/conflictList'),
      name: 'Conflict',
      hidden: true,
      meta: {
        title: 'route.conflict',
        affix: false,
        activeMenu: '/approve/approve_list',
        keepAlive: true
      }
    }]
  },
  // 会议服务
  {
    path: '/service',
    component: Layout,
    redirect: '/service/service_list',
    children: [{
      path: 'service_list',
      component: () => import('@views/appointment/service'),
      name: 'service',
      meta: {
        title: 'route.service',
        icon: 'service',
        affix: false,
        role: 'is_belong_service', // 权限
        keepAlive: true
      }
    }]
  },
  // 用户中心
  {
    path: '/user',
    component: Layout,
    redirect: '/user/info',
    children: [{
      path: 'info',
      component: () => import('@views/user'),
      name: 'User',
      meta: {
        title: 'route.user',
        affix: false,
        keepAlive: false,
        role: 'is_belong_user', // 权限
      },
      hidden: true
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()
// router.addRoutes(asyncRoutes)
// 重置路由
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router;
