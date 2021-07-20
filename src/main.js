import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'normalize.css/normalize.css'
import '@/styles/index.less'
import './permission'
import './icons'
import * as filter from './filter'
import './directive'
import i18n from './lang'
import { tableAutoHeight } from './mixin'
Vue.config.productionTip = false;
// 过滤器
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})
Vue.mixin(tableAutoHeight)
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
