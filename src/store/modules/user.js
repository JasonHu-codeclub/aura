/*
 * Created: 2021-03-02 11:09:06
 * Author : Jan
 * Last Modified: 2021-03-24 11:24:53
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */
import { getSystemInfoApi, getWebInfoApi } from '@/api/appoint'
import { loginApi, logoutApi, getInfoApi, getCodeApi, qyWechatLoginApi } from '@api/user'
import { getToken, setToken, removeToken, setUserName, getUserName, removeUserName } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import qs from 'querystring'
const state = {
  token: getToken(),//setUserName(), // 用户标识
  username: '',// 用户名称
  avatar: '', // 用户头像
  userId: '', // 用户id
  roles: '', // 用户菜单权限列表
  roleId: '',  // 角色id
  userInfo: '',// 用户信息
  isQrCode: false,
  qrCodeImage: '',
  systemLogo: '', // 系统信息
  systemName: '',  // 系统名称 
  companyName: '数字办公室' // 公司名称
}

const mutations = {
  SET_TOKEN (state, data) {
    state.token = data
  },
  SET_ROLES (state, data) {
    state.roles = data
  },
  SET_USERNAME (state, data) {
    state.username = data
  },
  SET_AVATAR (state, data) {
    state.avatar = data
  },
  SET_USERID (state, data) {
    state.userId = data
  },
  SET_ROLEID (state, data) {
    state.roleId = data
  },
  SET_USERINFO (state, data) {
    state.userInfo = data
  },
  SET_SYSTEMINFO (state, data) {
    state.systemLogo = data.front_system_inside_logo
    state.systemName = data.front_system_name
  },
  SET_COMPANYNAME (state, data) {
    state.companyName = data
  }
}

const actions = {
  // 登录
  login ({ commit }, data) {
    const { username, pwd, company } = data
    return new Promise((resolve, reject) => {
      loginApi(qs.stringify({ name: username.trim(), password: pwd })).then(response => {
        if(response&&response.meta.code=="RESP_OKAY"){
          const { data: { token } } = response
          commit('SET_TOKEN', token)
          setToken(token)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 第三方登录
  otherLogin ({ commit }, data) {
    const { code, state, appid } = data
    return new Promise((resolve, reject) => {
      qyWechatLoginApi({ appid, code }).then(response => {
        if(response&&response.meta.code=="RESP_OKAY"){
          const { data: { userinfo: { token } } } = response
          /* cookie保存 */
          commit('SET_TOKEN', token)
          setToken(token)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户个人信息
  getInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      // 获取个人信息
      getInfoApi().then(response => {
        const { data: { user } } = response
        if (!user) {
          reject('需要重新登录')
        }
        const { nickname, group, id, thumb_avatar, pc_permissions} = user
        commit('SET_ROLES', group.permissions)
        commit('SET_USERNAME', nickname)
        commit('SET_AVATAR', thumb_avatar)
        commit('SET_ROLEID', id)
        resolve(pc_permissions)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取系统前台信息
  getSystemInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getSystemInfoApi().then(res=>{
        if(res&&res.meta.code=="RESP_OKAY"){
          commit('SET_SYSTEMINFO', res.data.front_system_setting)
        }
        resolve(res)
      })
    }).catch(error => {
      reject(error)
    })
  },
  // 设置ico
  icoSetting ({ commit }, data) {
    return new Promise((resolve, reject) => {
      getWebInfoApi().then(res => {
        let {front_system_name, front_system_title_logo} = res.data.info
        if(res && res.meta.code=="RESP_OKAY"){
          commit('SET_COMPANYNAME', front_system_name)
        }
        resolve(front_system_title_logo)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 登录方式
  getCode ({ commit }, data) {
    return new Promise((resolve, reject) => {
      getCodeApi({code: data}).then(response => {
        resolve(response)
      })
    })
  },
  // 登出
  logout ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logoutApi().then((response) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 重置所有token标识
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', '')
      removeToken()
      resolve()
    })
  },
  // 动态修改角色权限
  changeRoles ({ commit, dispatch }, role) {
    // eslint-disable-next-line
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoute(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}