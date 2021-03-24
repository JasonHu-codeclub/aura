import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layout'
import nestedRouter from './modules/nested'

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
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      component: () => import('@views/home'),
      name: 'Home',
      meta: {
        title: '首页',
        icon: 'username',
        affix: true
      }
    }]
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
  nestedRouter,
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    children: [
      {
        path: 'index',
        component: () => import('@views/user/index'),
        name: 'User',
        meta: { title: '用户管理', icon: 'username', role: 'admin' }
      }
    ]
  },
  {
    path: '/appointment',
    component: Layout,
    redirect: '/appointment/index',
    children: [
      {
        path: 'index',
        component: () => import('@views/appointment/index'),
        name: 'Appointment',
        meta: { title: '会易订', icon: 'username', role: 'admin' }
      }
    ]
  },
  {
    path: '/visit',
    component: Layout,
    redirect: '/visit/index',
    children: [
      {
        path: 'index',
        component: () => import('@views/visit/index'),
        name: 'Visit',
        meta: { title: '访客通', icon: 'username', role: 'admin' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/index',
    children: [
      {
        path: 'index',
        component: () => import('@views/system/index'),
        name: 'System',
        meta: { title: '系统管理', icon: 'username' }
      }
    ]
  },
  {
    path: '/template',
    component: Layout,
    redirect: '/template/table',
    name: 'Template',
    alwaysShow: true,
    meta: {
      title: 'Template',
      icon: 'username'
    },
    children: [
      {
        path: 'table',
        component: () => import('@views/template/table'),
        name: 'Table',
        meta: { title: '表格功能' }
      },
      {
        path: 'upload_excel',
        component: () => import('@views/template/uploadExcel'),
        name: 'UploadExcel',
        meta: { title: '上传表格' }
      }
    ]
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
