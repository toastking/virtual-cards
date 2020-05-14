import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import { GameModule, GameState } from './store/modules/game';
import { PlayerState, PlayerModule } from './store/modules/player';
import { DeckState } from './store/modules/deck';

Vue.use(Vuex);

export interface State {
  game: GameState;
  player: PlayerState;
  decks: DeckState;
}

export default new Vuex.Store<State>({
  mutations: {
    ...vuexfireMutations,
  },
  actions: {
    doTurn({ dispatch }) {
      // Draw a card, wait a little bit, then go to the next player
      dispatch('drawCard');
      setTimeout(() => {
        dispatch('nextPlayer');
      }, 3000);
    },
  },
  modules: { game: GameModule, player: PlayerModule },
});
