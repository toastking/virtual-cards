import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import { GameModule, GameState } from './store/modules/game';
import { PlayerState, PlayerModule } from './store/modules/player';
import { DeckState, DeckModule } from './store/modules/deck';

Vue.use(Vuex);

export interface State {
  game: GameState;
  player: PlayerState;
  deck: DeckState;
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
  getters: {
    isYourTurn(state): boolean {
      return state.game.game.currentPlayer === state.player.userPlayerId;
    },
  },
  modules: { game: GameModule, player: PlayerModule, deck: DeckModule },
});
