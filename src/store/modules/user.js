/*
 * Created: 2021-03-02 11:09:06
 * Author : Jan
 * Last Modified: 2021-03-24 11:24:53
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

import { loginApi, logoutApi, getInfoApi, getCodeApi } from '@api/user'
import { getToken, setToken, removeToken, setUserName, getUserName, removeUserName } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import qs from 'querystring'
const state = {
  token: getToken(),//setUserName(), // 用户标识
  username: '',// 用户名称
  avatar: '', // 用户头像
  userId: '', // 用户id
  roles: [], // 用户菜单权限列表
  roleId: '',  // 角色id
  userInfo: '',// 用户信息
  isAutoLogin: true, // 登录方式
  isQrCode: false,
  qrCodeImage: ''
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
  SET_LOGINWAY (state, data) {
    state.isAutoLogin = data
  }
}

const actions = {
  // 登录
  login ({ commit }, data) {
    const { username, pwd, company } = data
    return new Promise((resolve, reject) => {
      loginApi(qs.stringify({ username: username.trim(), pwd: pwd, company: company })).then(response => {
        if(response.ret === '0'){
          commit('SET_USERNAME', username)
          setUserName(username)
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
      // const data = {
      //   roles: ["test6"],
      //   name: "Surper Man",
      //   avatar: "http://up.enterdesk.com/edpic/31/c3/fd/31c3fdc63511cabedd6415d121fa2d58.jpg"
      // }
      // const { roles, name, avatar } = data
      // commit('SET_ROLES', roles)
      // commit('SET_NAME', name)
      // commit('SET_AVATAR', avatar)
      // resolve(data)
      // 获取个人信息
      getInfoApi().then(response => {
        const data = response
        if (!data) {
          reject('需要重新登录')
        }
        data.roles = [data.username]
        const { username, role_id, user_guid,  image_url} = data
        commit('SET_ROLES', [data.username])
        commit('SET_USERNAME', username)
        commit('SET_USERID', user_guid)
        commit('SET_ROLEID', role_id)
        commit('SET_USERINFO', data)
        commit('SET_AVATAR', image_url)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 登录方式
  updateLoginWay ({ commit }, data) {
    commit('SET_LOGINWAY', data)
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
        // const { code } = response.data.data.meta
        commit('SET_USERNAME', '')
        commit('SET_ROLES', [])
        // 清除cookie中的token
        // removeToken()
        // 清除username
        removeUserName()
        resetRouter()
        // 清除tags
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 重置所有token标识
  resetUserInfo ({ commit }) {
    return new Promise(resolve => {
      commit('SET_USERNAME', '')
      commit('SET_ROLES', [])
      removeUserName()
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