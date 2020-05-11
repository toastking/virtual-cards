import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import { GameModule, GameState } from './store/modules/game';
import { PlayerState, PlayerModule } from './store/modules/player';

Vue.use(Vuex);

export interface State {
  game: GameState;
  player: PlayerState;
}

export default new Vuex.Store<State>({
  mutations: {
    ...vuexfireMutations,
  },
  actions: {},
  modules: { game: GameModule, player: PlayerModule },
});
