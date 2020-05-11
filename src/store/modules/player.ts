import { Module } from 'vuex';
import { db } from '@/db';
import { State } from '@/store';
import { firestoreAction } from 'vuexfire';

export interface Player {
  name: string;
  gameId: string;
}

export interface PlayerState {
  players: { [uid: string]: Player };
  currentPlayerId: string | null;
}

export const PlayerModule: Module<PlayerState, State> = {
  state: () => ({ currentPlayerId: null, players: {} }),
  mutations: {
    addPlayer(state, payload: { playerId: string; player: Player }) {
      state.players = { ...state.players, [payload.playerId]: payload.player };
    },
  },
  actions: {
    async addPlayer({ commit, rootState }, player: Player) {
      const gameId = rootState.game.gameId;
      if (gameId) {
        const newPlayer = await db
          .collection('games')
          .doc(gameId)
          .collection('players')
          .add(player);

        commit('addPlayerSuccess', { playerId: newPlayer.id, player });
      }
    },
    setupPlayerBinding: firestoreAction(({ bindFirestoreRef, rootState }) => {
      const { gameId } = rootState.game;
      if (gameId) {
        return bindFirestoreRef(
          'players',
          db
            .collection('games')
            .doc(gameId)
            .collection('players')
        );
      }
    }),
  },
};
