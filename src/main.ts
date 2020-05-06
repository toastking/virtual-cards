import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueCompositionApi from '@vue/composition-api';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import Vuex from 'vuex';
import * as firebase from 'firebase/app';
import 'firebase/analytics';

Vue.config.productionTip = false;

Vue.use(VueCompositionApi);
Vue.use(Buefy);
Vue.use(Vuex);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// Start up the firebase instance
const firebaseConfig = {
  apiKey: 'AIzaSyAoY1Lh5gjP0hVJz4eE1uq8t30EQUrV7gE',
  authDomain: 'remote-cards.firebaseapp.com',
  databaseURL: 'https://remote-cards.firebaseio.com',
  projectId: 'remote-cards',
  storageBucket: 'remote-cards.appspot.com',
  messagingSenderId: '329488959223',
  appId: '1:329488959223:web:8b49c51a9549754066b5f2',
  measurementId: 'G-95B074ZNZZ',
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
