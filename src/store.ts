import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import { DeckModule } from './store/modules/deck';
import { GameModule } from './store/modules/game';
import { HistoryModule } from './store/modules/history';
import { PlayerModule } from './store/modules/player';
import {
  DeckState,
  GameState,
  HistoryState,
  LoadingStatus,
  Player,
  PlayerState,
} from './store/state';

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
