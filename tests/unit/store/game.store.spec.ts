import { app } from '@/db';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';
import { GameModule } from '@/store/modules/game';
import {
  Game,
  Avatar,
  Player,
  GameState,
  PlayerState,
  LoadingStatus,
} from '@/store/state';

describe('Game Store Module', () => {
  const firebaseMock = exposeMockFirebaseApp(app);
  const actions = GameModule.actions!;

  beforeEach(() => {
    firebaseMock.firestore().mocker.reset(); // this will reset the whole database into an initial state
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
      const games = firebaseMock.firestore().mocker.collection('games');
      const gameId = Object.keys(games.mocker.getShallowCollection())[0];
      const game = games.mocker.doc(gameId);
      const expectedGame: Game = {
        currentPlayer: null,
        gameCompleted: false,
        gameStarted: false,
      };
      expect(game.mocker.getData()).toEqual(expectedGame);

      expect(dispatch).toHaveBeenCalledWith('joinGame', {
        gameId,
        playerName: 'foo',
      });
    });

    test('joinGame', async () => {
      const joinGame = actions.joinGame as Function;
      const dispatch = jest.fn();
      const commit = jest.fn();
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
      const firestore = firebaseMock.firestore();
      firestore.mocker.loadCollection('games', { xyz: { gameStarted: false } });

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

      const game = firestore.mocker
        .collection('games')
        .mocker.getShallowCollection().xyz;
      expect(game).toEqual(
        expect.objectContaining({ gameStarted: true, currentPlayer: 'foo' })
      );

      expect(dispatch).toHaveBeenCalledWith('addDeck');
    });

    test('restartGame', async () => {
      // Test that we update the gameStarted value for the game
      const restartGame = actions.restartGame as Function;
      const firestore = firebaseMock.firestore();
      firestore.mocker.loadCollection('games', {
        xyz: { gameStarted: true, gameCompleted: true },
      });

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

      const game = firestore.mocker
        .collection('games')
        .mocker.getShallowCollection().xyz;
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
