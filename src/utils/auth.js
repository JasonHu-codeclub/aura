/*
 * Created: 2021-03-02 09:18:07
 * Author : Jan
 * Last Modified: 2021-03-02 16:34:53
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

/**
  * 通过cookie管理用户标识token
  */

import Cookies from 'js-cookie'

const TokenKey = 'user-token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}