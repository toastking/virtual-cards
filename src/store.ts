import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import { DeckModule, DeckState } from './store/modules/deck';
import { GameModule, GameState, LoadingStatus } from './store/modules/game';
import { PlayerModule, PlayerState } from './store/modules/player';

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
    decks(state) {
      return state.deck.decks;
    },
    gameOver(state) {
      return state.game.game.gameCompleted;
    },
    isYourTurn(state): boolean {
      return (
        state.game.game.currentPlayer === state.player.userPlayerId &&
        !state.game.game.gameCompleted
      );
    },
    turnIsLoading(state): boolean {
      return state.game.turnLoadingState === LoadingStatus.LOADING;
    },
  },
  modules: { game: GameModule, player: PlayerModule, deck: DeckModule },
});
