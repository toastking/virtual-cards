import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import Vuex from 'vuex';
import VuePlayingCard from 'vue-playing-card';
import VueClipboard from 'vue-clipboard2';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.config.productionTip = false;

Vue.use(Buefy);
Vue.use(Vuex);
Vue.use(VuePlayingCard);
Vue.use(VueClipboard);

Vue.component('font-awesome-icon', FontAwesomeIcon);

// Add icons
library.add(faCopy);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
