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
  currentPlayerId: string | null;
}

export const PlayerModule: Module<PlayerState, State> = {
  state: () => ({ currentPlayerId: null, players: [] }),
  actions: {
    async addPlayer({ rootState }, player: Player) {
      const gameId = rootState.game.gameId;
      if (gameId) {
        await db
          .collection('games')
          .doc(gameId)
          .collection('players')
          .add(player);
      }
    },
    setupPlayerBinding: firestoreAction(
      async (
        { dispatch, bindFirestoreRef, rootState },
        payload: { hostPlayerName: string }
      ) => {
        const { gameId } = rootState.game;
        if (gameId) {
          // Add the initial player first so we can bind to the subcollection
          const hostPlayer: Player = { name: payload.hostPlayerName };
          dispatch('addPlayer', hostPlayer);

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
