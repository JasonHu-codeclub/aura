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
  return originalPush.call(this, location).catch(err => err)
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
  {
    path: '/login',
    component: () => import('@views/login'),
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/home',
  //   children: [{
  //     path: 'home',
  //     component: () => import('@views/home'),
  //     name: 'Home',
  //     meta: {
  //       title: '首页',
  //       icon: 'username',
  //       affix: true
  //     }
  //   }]
  // },
  
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
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      component: () => import('@views/appointment/appoint'),
      name: 'Home',
      meta: {
        title: 'home',
        icon: 'appo',
        affix: true
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
          title: 'current',
          icon: 'current',
          affix: false
        }
      },
      {
        path: 'details/:menu/:id',
        component: () => import('@views/appointment/current-meet/details'),
        name: 'Details',
        hidden: true,
        meta: {
          title: 'detailsMeet',
          affix: false,
          activeMenu: '/current/current_list'
        }
      },
      {
          path: 'repeat/:menu/:id',
          component: () => import('@views/appointment/current-meet/repeat'),
          name: 'Repeat',
          hidden: true,
          meta: {
            title: 'repeatMeet',
            affix: false,
            activeMenu: '/current/current_list'
          }
      },
      {
          path: 'edit/:id',
          component: () => import('@views/appointment/current-meet/edit'),
          name: 'Edit',
          hidden: true,
          meta: {
            title: 'editMeet',
            affix: false
          }
      },
    ]
  },
  {
    path: '/history',
    component: Layout,
    redirect: '/history/history_list',
    children: [{
      path: 'history_list',
      component: () => import('@views/appointment/history-record'),
      name: 'HistoryRecord',
      meta: {
        title: 'history',
        icon: 'history',
        affix: false
      }
    }]
  },
  {
    path: '/approve',
    component: Layout,
    redirect: '/approve/approve_list',
    children: [{
      path: 'approve_list',
      component: () => import('@views/appointment/approve'),
      name: 'Approve',
      meta: {
        title: 'Approve',
        icon: 'history',
        affix: false
      }
    }]
  },
  {
    path: '/service',
    component: Layout,
    redirect: '/service/service_list',
    children: [{
      path: 'service_list',
      component: () => import('@views/appointment/service'),
      name: 'service',
      meta: {
        title: 'service',
        icon: 'history',
        affix: false
      }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/info',
    children: [{
      path: 'info',
      component: () => import('@views/user'),
      name: 'User',
      meta: {
        title: 'user',
        affix: false
      },
      hidden: true
    }]
  },
  
  // appointment,
  // visit,
  
  // {
  //   path: '/template',
  //   component: Layout,
  //   redirect: '/template/table',
  //   name: 'Template',
  //   alwaysShow: true,
  //   meta: {
  //     title: 'Template',
  //     icon: 'username'
  //   },
  //   children: [
  //     {
  //       path: 'table',
  //       component: () => import('@views/template/table'),
  //       name: 'Table',
  //       meta: { title: '表格功能' }
  //     },
  //     {
  //       path: 'upload_excel',
  //       component: () => import('@views/template/uploadExcel'),
  //       name: 'UploadExcel',
  //       meta: { title: '上传表格' }
  //     }
  //   ]
  // },
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
