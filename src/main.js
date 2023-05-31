
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
import "@/mock/index";

Vue.config.productionTip = false;
// 过滤器
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})


Vue.directive("canAppointment", {
  bind: function (el) {
    let appointment = store.getters.appointment;
    if (appointment == false) {
      el.style.display = "none";
    }
  }
});

Vue.mixin(tableAutoHeight)
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
