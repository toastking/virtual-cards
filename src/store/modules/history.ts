import { db } from '@/db';
import { State } from '@/store';
import { Module } from 'vuex';
import { firestoreAction } from 'vuexfire';
import { Player } from './player';
import { firestore } from 'firebase';

/** A record of what card was drawn by what user */
export interface HistoryEntry {
  playerId: string;
  /** String representation of a card based on vue-plaing-card */
  card: string;
  timestamp: firestore.Timestamp;
}
/** State for which card was drawn and when */
export interface HistoryState {
  history: HistoryEntry[];
}

export const HistoryModule: Module<HistoryState, State> = {
  actions: {
    /** Adds the history to a game */
    addHistory({ rootState }, payload: { player: Player; card: string }) {
      const historyEntry: HistoryEntry = {
        playerId: payload.player?.id ?? '',
        card: payload.card,
        timestamp: firestore.Timestamp.fromDate(new Date()),
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
    setupHistoryBinding: firestoreAction(({ rootState, bindFirestoreRef }) => {
      const { gameId } = rootState.game;
      if (gameId) {
        return bindFirestoreRef(
          'history',
          db
            .collection('games')
            .doc(gameId)
            .collection('history')
            .orderBy('timestamp')
        );
      }
    }),
  },
};
