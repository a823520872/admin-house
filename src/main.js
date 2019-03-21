import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import directive from './utils/directive.js';
import request from './api/index.js';
import mixin from './mixin';

Vue.use(ElementUI);
Vue.use(directive);

Vue.config.productionTip = false;
Vue.prototype.$request = request;
Vue.mixin(mixin);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
