import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import Vuex from 'vuex';

import VuePlayingCard from 'vue-playing-card';
// Vue.config.productionTip = false;

Vue.use(Buefy);
Vue.use(Vuex);
Vue.use(VuePlayingCard);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
