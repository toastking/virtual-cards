import { db } from '@/db';
import router from '@/router';
import { State } from '@/store';
import { Module } from 'vuex';
import { firestoreAction } from 'vuexfire';
import { Avatar, Game, GameState, LoadingStatus, Player } from '../state';

/** Module to handle game state. This is things like the game ID and the completion state. */
export const GameModule: Module<GameState, State> = {
  state: () => ({
    gameId: null,
    gameLoadingStatus: LoadingStatus.NOT_STARTED,
    turnLoadingState: LoadingStatus.OK,
    game: {
      currentPlayer: null,
      gameCompleted: false,
      gameStarted: false,
    },
  }),
  mutations: {
    createGameSuccess(state, payload: { newGameId: string }) {
      state.gameId = payload.newGameId;
      state.gameLoadingStatus = LoadingStatus.OK;
    },
    turnRequestStarted(state) {
      state.turnLoadingState = LoadingStatus.LOADING;
    },
    turnRequestDone(state) {
      state.turnLoadingState = LoadingStatus.OK;
    },
  },
  actions: {
    /** Create a new game object and route to the lobby */
    async createGame(
      { dispatch },
      payload: { hostPlayerName: string; avatar: Avatar }
    ) {
      const dummyGame: Game = {
        currentPlayer: null,
        gameCompleted: false,
        gameStarted: false,
      };
      const newGame = await db.collection('games').add(dummyGame);

      dispatch('joinGame', {
        gameId: newGame.id,
        playerName: payload.hostPlayerName,
        avatar: payload.avatar,
      });
    },
    /** Joins a game by setting the gameId and creating a player with the player info */
    joinGame(
      { dispatch, commit },
      payload: { gameId: string; playerName: string; avatar: Avatar }
    ) {
      commit('createGameSuccess', { newGameId: payload.gameId });

      const player: Player = {
        name: payload.playerName,
        avatar: payload.avatar,
      };
      dispatch('addUserPlayer', player);

      dispatch('routeToLobby', { newGameId: payload.gameId });
    },
    /** Changes the gameStarted boolean so the game is started  */
    startGame({ state, dispatch, rootState }) {
      const { gameId } = state;

      dispatch('addDeck');
      if (gameId) {
        // set game started to true and set the current player id to the first player
        const firstPlayerId = rootState.player.players[0].id;
        return db
          .collection('games')
          .doc(gameId)
          .update({ gameStarted: true, currentPlayer: firstPlayerId });
      }
    },
    /** Restart the game when a game is over */
    restartGame({ state, rootState }) {
      const { gameId } = state;
      if (gameId) {
        // set game started to true and set the current player id to the first player
        const firstPlayerId = rootState.player.players[0].id;
        const updatedGame: Partial<Game> = {
          gameStarted: true,
          gameCompleted: false,
          currentPlayer: firstPlayerId,
        };

        return db
          .collection('games')
          .doc(gameId)
          .update(updatedGame);
      }
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
      router.push({ name: 'lobby', params: { gameid: payload.newGameId } });
    },
    routeToGame({ state }) {
      const { gameId } = state;
      if (gameId) {
        router.push({ name: 'game', params: { gameId } });
      }
    },
  },
};
