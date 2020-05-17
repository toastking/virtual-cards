import { db } from '@/db';
import { State } from '@/store';
import { firestore } from 'firebase';
import { Module } from 'vuex';
import { firestoreAction } from 'vuexfire';
import { Player } from './player';

/** A record of what card was drawn by what user */
export interface HistoryEntry {
  playerId: string;
  /** String representation of a card based on vue-plaing-card */
  card: string;
  timestamp: firestore.Timestamp;
}
/** State for which card was drawn and when */
export interface HistoryState {
  history: HistoryEntry[] | null;
}

export const HistoryModule: Module<HistoryState, State> = {
  state: () => ({ history: [] }),
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
