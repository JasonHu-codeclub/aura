/*
 * Created: 2021-03-03 14:29:27
 * Author : Jan
 * Last Modified: 2021-03-24 11:08:12
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'

// 全局注册
Vue.component('svg-icon', SvgIcon)
//自动导入图片 
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)