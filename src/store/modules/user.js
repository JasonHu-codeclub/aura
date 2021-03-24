/*
 * Created: 2021-03-02 11:09:06
 * Author : Jan
 * Last Modified: 2021-03-24 11:24:53
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

import { loginApi, logoutApi, getInfoApi } from '@api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(), // 用户标识
  name: '', // 用户名称
  avatar: '', // 用户头像
  userId: '', // 用户id
  roles: [] // 用户菜单权限列表
}

const mutations = {
  SET_TOKEN (state, data) {
    state.token = data
  },
  SET_ROLES (state, data) {
    state.roles = data
  },
  SET_NAME (state, data) {
    state.name = data
  },
  SET_AVATAR (state, data) {
    state.avatar = data
  },
  SET_USERID (state, data) {
    state.userId = data
  }
}

const actions = {
  // 登录
  login ({ commit }, data) {
    const { username, password } = data
    return new Promise((resolve, reject) => {
      loginApi({ name: username.trim(), password: password }).then(response => {
        const { code, token } = response.data.data.meta
        console.log('login-data===', data)
        if (code === 'RESP_OKAY') {
          commit('SET_TOKEN', token)
          // cookie保存
          setToken(token)
          resolve()
        }
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
        const { data } = response
        if (!data) {
          reject('需要重新登录')
        }
        const { name, roles, id } = data.data.meta
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_USERID', id)
        // commit('SET_AVATAR', `https://ui-avatars.com/api/?name=${name}&background=random`)
        commit('SET_AVATAR', `http://up.enterdesk.com/edpic/31/c3/fd/31c3fdc63511cabedd6415d121fa2d58.jpg`)
        resolve(data.data.meta)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 登出
  logout ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logoutApi().then((response) => {
        const { code } = response.data.data.meta
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        // 清除cookie中的token
        removeToken()
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
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
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
      router.addRoutes(accessRoutes)

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