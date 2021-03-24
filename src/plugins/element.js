import Vue from 'vue'
import Cookies from 'js-cookie'
import Element from 'element-ui'

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

