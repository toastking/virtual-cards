import { Module, ActionTree } from 'vuex';
import { CREATE_GAME_SUCCESS } from '../mutation-types';
import { createGame, setupGameBinding } from '../action-types';
import { db } from '@/db';
import { firestoreAction } from 'vuexfire';
import { State } from '@/store';
import router from '@/router';
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
    [CREATE_GAME_SUCCESS](state, payload: { newGameId: string }) {
      state.gameId = payload.newGameId;
      state.gameLoadingStatus = LoadingStatus.OK;
    },
  },
  actions: {
    /** Create a new game object and route to the lobby */
    async createGame(
      { dispatch, commit },
      payload: { hostPlayerName: string }
    ) {
      const dummyGame: Game = {
        currentCard: null,
        currentPlayer: null,
        gameCompleted: false,
      };
      const newGame = await db.collection('games').add(dummyGame);

      // After we added the game add the host player
      const hostPlayer: Player = { name: payload.hostPlayerName };
      await dispatch('addPlayer', hostPlayer);

      commit(CREATE_GAME_SUCCESS, { newGameId: newGame.id });
      dispatch('routeToLobby', { newGameId: newGame.id });
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
