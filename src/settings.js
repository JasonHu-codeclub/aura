/*
 * Created: 2021-02-22 10:16:04
 * Author : Jan
 * Last Modified: 2021-03-24 10:32:15
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

// 全局设置项

module.exports = {
  title: 'Auralabs数字办公空间',

  /**
   * @type {boolean} true | false
   * @description 是否展示设置面板
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description 是否展示tags
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否 fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description 是否展示logo在侧边栏
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
