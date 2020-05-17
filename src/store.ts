import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import { DeckModule, DeckState } from './store/modules/deck';
import { GameModule, GameState, LoadingStatus } from './store/modules/game';
import { HistoryModule, HistoryState } from './store/modules/history';
import { Player, PlayerModule, PlayerState } from './store/modules/player';

Vue.use(Vuex);

export interface State {
  game: GameState;
  player: PlayerState;
  deck: DeckState;
  history: HistoryState;
}

export default new Vuex.Store<State>({
  mutations: {
    ...vuexfireMutations,
  },
  actions: {
    async doTurn({ dispatch, commit, getters }) {
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
    currentPlayer(state): Player | undefined {
      const id = state.game.game.currentPlayer;
      return state.player.players.find(player => id === player.id);
    },
    historyWithPlayerInfo(state) {
      // map the player info to an id
      const playerMapping: Map<string, Player> = new Map();

      for (const player of state.player.players) {
        const { id } = player;
        if (id) {
          playerMapping.set(id, player);
        }
      }

      if (state.history.history) {
        return state.history.history.map(entry => ({
          ...entry,
          player: playerMapping.get(entry.playerId),
        }));
      }
      return [];
    },
  },
  modules: {
    game: GameModule,
    player: PlayerModule,
    deck: DeckModule,
    history: HistoryModule,
  },
});
