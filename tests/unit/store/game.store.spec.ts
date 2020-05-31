import { db } from '@/db';
import { GameModule } from '@/store/modules/game';
import {
  Avatar,
  Game,
  GameState,
  LoadingStatus,
  Player,
  PlayerState,
} from '@/store/state';
import * as firebase from '@firebase/testing';

jest.mock('@/db');

describe('Game Store Module', () => {
  const actions = GameModule.actions!;

  beforeEach(() => {
    firebase.clearFirestoreData({ projectId: 'remote-cards' });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Actions', () => {
    test('createGame', async () => {
      const createGameAction = actions.createGame as Function;
      const dispatch = jest.fn();
      const commit = jest.fn();

      await createGameAction({ dispatch, commit }, { hostPlayerName: 'foo' });

      // Test the game and player were added
      const games = (await db.collection('games').get()).docs;
      const expectedGame: Game = {
        currentPlayer: null,
        gameCompleted: false,
        gameStarted: false,
      };
      const game = games[0].data();
      expect(game).toEqual(expectedGame);

      const gameId = games[0].id;
      expect(dispatch).toHaveBeenCalledWith('joinGame', {
        gameId,
        playerName: 'foo',
      });
    });

    test.only('joinGame', async () => {
      const joinGame = actions.joinGame as Function;
      const dispatch = jest.fn();
      const commit = jest.fn();
      // Setup the game
      await db
        .collection('games')
        .doc('xyz')
        .set({});
      await joinGame(
        { dispatch, commit },
        { gameId: 'xyz', playerName: 'foo', avatar: Avatar.NONE }
      );

      expect(commit).toHaveBeenCalledWith('createGameSuccess', {
        newGameId: 'xyz',
      });
      const expectedPlayer: Player = { name: 'foo', avatar: Avatar.NONE };
      expect(dispatch).toHaveBeenCalledWith('addUserPlayer', expectedPlayer);

      expect(dispatch).toHaveBeenCalledWith('routeToLobby', {
        newGameId: 'xyz',
      });
    });

    test('startGame', async () => {
      // Test that we update the gameStarted value for the game
      const startGame = actions.startGame as Function;
      const dispatch = jest.fn();

      await db
        .collection('games')
        .doc('xyz')
        .set({ gameStarted: false });

      const state: Partial<GameState> = {
        gameId: 'xyz',
        game: {
          currentPlayer: null,
          gameCompleted: false,
          gameStarted: false,
        },
      };
      const player: Partial<PlayerState> = {
        players: [{ name: 'mort', id: 'foo', avatar: Avatar.NONE }],
      };
      const rootState = { player };

      await startGame({ state, dispatch, rootState });

      const game = (
        await db
          .collection('games')
          .doc('xyz')
          .get()
      ).data();

      expect(game).toEqual(
        expect.objectContaining({ gameStarted: true, currentPlayer: 'foo' })
      );

      expect(dispatch).toHaveBeenCalledWith('addDeck');
    });

    test('restartGame', async () => {
      // Test that we update the gameStarted value for the game
      const restartGame = actions.restartGame as Function;

      await db
        .collection('games')
        .doc('xyz')
        .set({ gameStarted: true, gameCompleted: true });

      const state: Partial<GameState> = {
        gameId: 'xyz',
        game: {
          currentPlayer: null,
          gameCompleted: false,
          gameStarted: false,
        },
      };
      const player: Partial<PlayerState> = {
        players: [{ name: 'mort', id: 'foo', avatar: Avatar.NONE }],
      };
      const rootState = { player };

      await restartGame({ state, rootState });

      const game = (
        await db
          .collection('games')
          .doc('xyz')
          .get()
      ).data();

      expect(game).toEqual(
        expect.objectContaining({
          gameStarted: true,
          gameCompleted: false,
          currentPlayer: 'foo',
        })
      );
    });
  });

  describe('mutations', () => {
    const mutations = GameModule.mutations!;
    test('createGameSuccess adds the gameid', () => {
      const createGameSuccess = mutations.createGameSuccess;
      const state: GameState = {
        game: {
          currentPlayer: null,
          gameCompleted: false,
          gameStarted: false,
        },
        gameId: null,
        gameLoadingStatus: LoadingStatus.NOT_STARTED,
        turnLoadingState: LoadingStatus.OK,
      };
      createGameSuccess(state, { newGameId: 'foo' });
      expect(state.gameId).toBe('foo');
      expect(state.gameLoadingStatus).toBe(LoadingStatus.OK);
    });
  });
});
