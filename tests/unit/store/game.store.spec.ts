import { app } from '@/db';
import {
  GameModule,
  GameState,
  LoadingStatus,
  Game,
} from '@/store/modules/game';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';

describe('Game Store Module', () => {
  const firebaseMock = exposeMockFirebaseApp(app);
  const actions = GameModule.actions!;

  beforeEach(() => {
    firebaseMock.firestore().mocker.reset(); // this will reset the whole database into an initial state
  });

  describe('Actions', () => {
    test('should create new game object then add the host player', async () => {
      const createGameAction = actions.createGame as Function;
      const dispatch = jest.fn();
      const commit = jest.fn();

      await createGameAction({ dispatch, commit }, { hostPlayerName: 'foo' });
      expect(dispatch).toHaveBeenCalledWith('addPlayer', { name: 'foo' });

      // Test the game and player were added
      const games = firebaseMock.firestore().mocker.collection('games');
      const gameId = Object.keys(games.mocker.getShallowCollection())[0];
      const game = games.mocker.doc(gameId);
      const expectedGame: Game = {
        currentCard: null,
        currentPlayer: null,
        gameCompleted: false,
      };
      expect(game.mocker.getData()).toEqual(expectedGame);

      expect(dispatch).toHaveBeenCalledWith('routeToLobby', {
        newGameId: expect.any(String),
      });
    });
  });

  describe('mutations', () => {
    const mutations = GameModule.mutations!;
    test('createGameSuccess adds the gameid', () => {
      const createGameSuccess = mutations.createGameSuccess;
      const state: GameState = {
        game: { currentCard: null, currentPlayer: null, gameCompleted: false },
        gameId: null,
        gameLoadingStatus: LoadingStatus.NOT_STARTED,
      };
      createGameSuccess(state, { newGameId: 'foo' });
      expect(state.gameId).toBe('foo');
      expect(state.gameLoadingStatus).toBe(LoadingStatus.OK);
    });
  });
});