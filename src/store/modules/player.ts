import { Module } from 'vuex';
import { db } from '@/db';
import { State } from '@/store';
import { firestoreAction } from 'vuexfire';

export interface Player {
  name: string;
  id?: string;
}

export interface PlayerState {
  players: [];
  /** The player id for the current user */
  userPlayerId: string;
}

/** Module to handle player state, like who's in the game and who is the current player. */
export const PlayerModule: Module<PlayerState, State> = {
  state: () => ({ currentPlayerId: null, players: [], userPlayerId: '' }),
  mutations: {
    updateUserPlayerId(state, payload: { playerId: string }) {
      state.userPlayerId = payload.playerId;
    },
  },
  actions: {
    /** Add a player to the firebase store */
    async addPlayer({ rootState }, player: Player) {
      const { gameId } = rootState.game;
      if (gameId) {
        return db
          .collection('games')
          .doc(gameId)
          .collection('players')
          .add(player);
      }
    },
    /** Sets up the firebase binding for the players list  */
    setupPlayerBinding: firestoreAction(
      async ({ bindFirestoreRef, rootState }) => {
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
      }
    ),
    /** Stores the player id in session in case the page reloads */
    storePlayerId({}, payload: { playerId: string }) {
      sessionStorage.setItem('playerId', payload.playerId);
    },
  },
};
