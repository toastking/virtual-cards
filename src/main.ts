import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueCompositionApi from '@vue/composition-api';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import Vuex from 'vuex';

// Vue.config.productionTip = false;

Vue.use(VueCompositionApi);
Vue.use(Buefy);
Vue.use(Vuex);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
