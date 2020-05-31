import { db, fieldValues, timestamp } from '@/db';
import { State } from '@/store';
import { firestore } from 'firebase';
import { Module } from 'vuex';
import { firestoreAction } from 'vuexfire';
import { HistoryEntry, HistoryState, Player } from '../state';

export const HistoryModule: Module<HistoryState, State> = {
  state: () => ({ history: [] }),
  actions: {
    /** Adds the history to a game */
    addHistory({ rootState }, payload: { player: Player; card: string }) {
      const historyEntry: HistoryEntry = {
        playerId: payload.player?.id ?? '',
        card: payload.card,
        timestamp: timestamp.fromDate(new Date()),
      };

      const { gameId } = rootState.game;
      if (gameId) {
        return db
          .collection('games')
          .doc(gameId)
          .collection('history')
          .add(historyEntry);
      }
    },
    setupHistoryBinding: firestoreAction(
      async ({ rootState, bindFirestoreRef }) => {
        const { gameId } = rootState.game;
        if (gameId) {
          return bindFirestoreRef(
            'history',
            db
              .collection('games')
              .doc(gameId)
              .collection('history')
              .orderBy('timestamp', 'desc')
          );
        }
      }
    ),
  },
  getters: {
    historyForPlayer(state) {
      return (player: Player) => {
        if (state.history) {
          return state.history.filter(entry => entry.playerId === player.id);
        }
      };
    },
  },
};
