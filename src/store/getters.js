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
  name: state => state.user.username,
  userId: state => state.user.userId,
  roleId: state => state.user.roleId,
  avatar: state => state.user.avatar,
  userInfo: state => state.user.userInfo,
  permission_routes: state => state.permission.routes,
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  isQrCode: state => state.app.isQrCode,
  qrCodeImage: state => state.app.qrCodeImage,
}
export default getters