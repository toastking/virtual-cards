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
}

/** Module to handle player state, like who's in the game and who is the current player. */
export const PlayerModule: Module<PlayerState, State> = {
  state: () => ({ currentPlayerId: null, players: [] }),
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
  },
};
