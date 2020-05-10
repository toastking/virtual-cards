import { Module, ActionTree } from 'vuex';
import { CREATE_GAME_SUCCESS } from '../mutation-types';
import { createGame, setupGameBinding } from '../action-types';
import { db } from '@/db';
import { firestoreAction } from 'vuexfire';

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

export const actions: ActionTree<GameState, {}> = {
  async [createGame]({ dispatch }) {
    const dummyGame: Game = {
      currentCard: null,
      currentPlayer: null,
      gameCompleted: false,
    };
    const newGame = await db.collection('games').add(dummyGame);

    dispatch(setupGameBinding, { newGameId: newGame.id });
  },
  [setupGameBinding]: firestoreAction(
    ({ commit, bindFirestoreRef }, payload: { newGameId: string }) => {
      commit(CREATE_GAME_SUCCESS, payload);
      return bindFirestoreRef(
        'game',
        db.collection('games').doc(payload.newGameId),
      );
    },
  ),
};

export const GameModule: Module<GameState, {}> = {
  state: () => ({
    gameId: null,
    gameLoadingStatus: LoadingStatus.NOT_STARTED,
    game: { currentCard: null, currentPlayer: null, gameCompleted: false },
  }),
  mutations: {
    [CREATE_GAME_SUCCESS](state, payload: { newGameId: string }) {
      return {
        ...state,
        gameId: payload.newGameId,
        gameLoadingStatus: LoadingStatus.OK,
      };
    },
  },
  actions,
};
