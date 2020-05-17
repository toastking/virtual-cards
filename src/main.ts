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
import { faCopy, faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.config.productionTip = false;

// Add icons
library.add(faCopy);
library.add(faRedo);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Buefy, {
  defaultIconComponent: 'font-awesome-icon',
  defaultIconPack: 'fas',
});
Vue.use(Vuex);
Vue.use(VuePlayingCard);
Vue.use(VueClipboard);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
