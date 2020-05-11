import { Module, ActionTree } from 'vuex';
import { CREATE_GAME_SUCCESS } from '../mutation-types';
import { createGame, setupGameBinding } from '../action-types';
import { db } from '@/db';
import { firestoreAction } from 'vuexfire';
import { State } from '@/store';

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
    async [createGame]({ dispatch }, payload: { hostPlayerName: string }) {
      const dummyGame: Game = {
        currentCard: null,
        currentPlayer: null,
        gameCompleted: false,
      };
      const newGame = await db.collection('games').add(dummyGame);
      debugger;

      dispatch(setupGameBinding, {
        newGameId: newGame.id,
        hostPlayerName: payload.hostPlayerName,
      });
      dispatch('setupPlayerBinding');
    },
    [setupGameBinding]: firestoreAction(
      (
        { commit, bindFirestoreRef },
        payload: { newGameId: string; hostPlayerName: string },
      ) => {
        commit(CREATE_GAME_SUCCESS, { newGameId: payload.newGameId });
        commit('addPlayer', { hostPlayerName: payload.hostPlayerName });
        return bindFirestoreRef(
          'game',
          db.collection('games').doc(payload.newGameId),
          { reset: false },
        );
      },
    ),
  },
};
