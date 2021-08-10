import Vue from 'vue'
import Cookies from 'js-cookie'
import Element from 'element-ui'
import i18n from '../lang/index';
import {
  message
} from '@/utils/resetMessage';
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.prototype.$message = message;