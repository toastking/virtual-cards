import { db } from '@/db';
import router from '@/router';
import { State } from '@/store';
import { Module } from 'vuex';
import { firestoreAction } from 'vuexfire';
import { Player } from './player';

export enum LoadingStatus {
  NOT_STARTED,
  LOADING,
  OK,
  ERROR,
}

/** Represents the general state of a card game */
export interface Game {
  currentPlayer: string | null;
  currentCard: null;
  gameCompleted: boolean;
}

export interface GameState {
  gameId: string | null;
  gameLoadingStatus: LoadingStatus;
  game: Game;
}

/** Module to handle game state. This is things like the game ID and the completion state. */
export const GameModule: Module<GameState, State> = {
  state: () => ({
    gameId: null,
    gameLoadingStatus: LoadingStatus.NOT_STARTED,
    game: { currentCard: null, currentPlayer: null, gameCompleted: false },
  }),
  mutations: {
    createGameSuccess(state, payload: { newGameId: string }) {
      state.gameId = payload.newGameId;
      state.gameLoadingStatus = LoadingStatus.OK;
    },
  },
  actions: {
    /** Create a new game object and route to the lobby */
    async createGame({ dispatch }, payload: { hostPlayerName: string }) {
      const dummyGame: Game = {
        currentCard: null,
        currentPlayer: null,
        gameCompleted: false,
      };
      const newGame = await db.collection('games').add(dummyGame);
      dispatch('joinGame', {
        gameId: newGame.id,
        playerName: payload.hostPlayerName,
      });
    },
    /** Joins a game by setting the gameId and creating a player with the player info */
    joinGame(
      { dispatch, commit },
      payload: { gameId: string; playerName: string }
    ) {
      commit('createGameSuccess', { newGameId: payload.gameId });

      const player: Player = { name: payload.playerName };
      dispatch('addUserPlayer', player);

      dispatch('routeToLobby', { newGameId: payload.gameId });
    },
    /** Setup the firebase binding for the game */
    setupGameBinding: firestoreAction(async ({ bindFirestoreRef, state }) => {
      const { gameId } = state;
      if (gameId) {
        return bindFirestoreRef('game', db.collection('games').doc(gameId), {
          reset: false,
        });
      }
    }),
    routeToLobby({}, payload: { newGameId: string }) {
      router.push(`lobby/${payload.newGameId}`);
    },
  },
};
