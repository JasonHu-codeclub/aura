/*
 * Created: 2021-03-02 11:06:37
 * Author : Jan
 * Last Modified: 2021-03-03 14:53:52
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

const getters = {
  roles: state => state.user.roles,
  token: state => state.user.token,
  name: state => state.user.name,
  userId: state => state.user.userId,
  avatar: state => state.user.avatar,
  permission_routes: state => state.permission.routes,
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device
}
export default getters