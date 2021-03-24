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
Vue.config.productionTip = false;

// 过滤器
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
