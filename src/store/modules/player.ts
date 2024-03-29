import { db } from '@/db';
import { State } from '@/store';
import { Module } from 'vuex';
import { firestoreAction } from 'vuexfire';
import { Game, Player, PlayerState } from '../state';

/** Module to handle player state, like who's in the game and who is the current player. */
export const PlayerModule: Module<PlayerState, State> = {
  state: () => ({ players: [], userPlayerId: '', currentPlayerIndex: 0 }),
  mutations: {
    updateUserPlayerId(state, payload: { playerId: string }) {
      state.userPlayerId = payload.playerId;
    },
  },
  actions: {
    /** Update the player id to the next player in the list */
    async nextPlayer({ state, rootState }) {
      const currentPlayerId = rootState.game.game.currentPlayer;
      const currentPlayerIndex = state.players.findIndex(
        player => player.id === currentPlayerId
      );
      const nextIndex = (currentPlayerIndex + 1) % state.players.length;
      const nextPlayerId = state.players[nextIndex].id;

      // Update the game object
      const toUpdate: Partial<Game> = { currentPlayer: nextPlayerId };
      db.doc(`games/${rootState.game.gameId}`).update(toUpdate);
    },
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
    /** Adds the player for the current user */
    async addUserPlayer({ dispatch, commit }, player: Player) {
      const newPlayer: firebase.firestore.DocumentReference<
        firebase.firestore.DocumentData
      > | null = await dispatch('addPlayer', player);

      if (newPlayer) {
        commit('updateUserPlayerId', { playerId: newPlayer.id });
        dispatch('storePlayerId', { playerId: newPlayer.id });
      }
    },
    /** Allow a user to change their name */
    changePlayerName({ rootState, getters }, newName: string) {
      const { gameId } = rootState.game;
      const playerId: string | undefined = getters.userPlayer?.id;
      if (gameId && playerId) {
        const updatedName: Partial<Player> = { name: newName };
        return db
          .collection('games')
          .doc(gameId)
          .collection('players')
          .doc(playerId)
          .update(updatedName);
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
  getters: {
    userPlayer(state): Player | undefined {
      return state.players.find(player => player.id === state.userPlayerId);
    },
  },
};
