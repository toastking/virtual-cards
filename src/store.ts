import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import { GameModule } from './store/modules/game';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    ...vuexfireMutations,
  },
  actions: {},
  modules: { game: GameModule },
});
