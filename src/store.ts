import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import { GameModule, GameState, LoadingStatus } from './store/modules/game';
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
    async doTurn({ dispatch, commit }) {
      commit('turnRequestStarted');

      // Draw a card, wait a little bit, then go to the next player
      await dispatch('drawCard');
      await dispatch('nextPlayer');

      commit('turnRequestDone');
    },
  },
  getters: {
    gameOver(state) {
      return state.game.game.gameCompleted;
    },
    isYourTurn(state): boolean {
      return state.game.game.currentPlayer === state.player.userPlayerId;
    },
    turnIsLoading(state): boolean {
      return state.game.turnLoadingState === LoadingStatus.LOADING;
    },
  },
  modules: { game: GameModule, player: PlayerModule, deck: DeckModule },
});
