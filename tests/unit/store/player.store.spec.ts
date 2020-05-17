import { app } from '@/db';
import { GameState } from '@/store/modules/game';
import {
  Avatar,
  Player,
  PlayerModule,
  PlayerState,
} from '@/store/modules/player';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';

describe('Player Store Module', () => {
  const firebaseMock = exposeMockFirebaseApp(app);
  const actions = PlayerModule.actions!;

  beforeEach(() => {
    firebaseMock.firestore().mocker.reset(); // this will reset the whole database into an initial state
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('actions', () => {
    test('addPlayer', async () => {
      const firestoreMock = firebaseMock.firestore().mocker;
      const player: Player = { name: 'foo', avatar: Avatar.NONE };
      const gameState: Partial<GameState> = { gameId: 'xyz' };
      const rootState = { game: gameState };
      const addPlayer = actions.addPlayer as Function;

      await addPlayer({ rootState }, player);
      const game = firestoreMock.collection('games').mocker.doc('xyz').mocker;
      const players = game.collection('players').mocker.getShallowCollection();

      expect(Object.values(players)).toEqual([player]);
    });

    test('addUserPlayer', async () => {
      const addUserPlayer = actions.addUserPlayer as Function;
      const commit = jest.fn();
      const dispatch = jest
        .fn()
        .mockReturnValue(Promise.resolve({ id: 'xyz' }));
      const mockPlayer: Player = { name: 'foo', avatar: Avatar.NONE };

      await addUserPlayer({ commit, dispatch }, mockPlayer);

      expect(dispatch).toHaveBeenCalledWith('addPlayer', mockPlayer);
      expect(commit).toHaveBeenCalledWith('updateUserPlayerId', {
        playerId: 'xyz',
      });
      expect(dispatch).toHaveBeenCalledWith('storePlayerId', {
        playerId: 'xyz',
      });
    });

    test('storePlayerId', async () => {
      const storePlayerId = actions.storePlayerId as Function;

      await storePlayerId({}, { playerId: 'foo' });
      expect(sessionStorage.setItem).toBeCalledWith('playerId', 'foo');
    });

    test('nextPlayer', async () => {
      const nextPlayer = actions.nextPlayer as Function;

      const game: Partial<GameState> = {
        game: {
          gameCompleted: false,
          gameStarted: true,
          currentPlayer: 'id1',
        },
        gameId: 'xyz',
      };
      const rootState = { game };

      const state: Partial<PlayerState> = {
        players: [
          { name: 'hello', id: 'id1', avatar: Avatar.NONE },
          { name: 'world', id: 'id2', avatar: Avatar.NONE },
        ],
      };
      firebaseMock
        .firestore()
        .doc('games/xyz')
        .set({ currentPlayer: 'id1' });

      await nextPlayer({ state, rootState });

      const updatedGame = await firebaseMock
        .firestore()
        .doc('games/xyz')
        .get();
      expect(updatedGame.data()!.currentPlayer).toBe('id2');
    });
  });

  describe('mutations', () => {
    const mutations = PlayerModule.mutations!;

    test('updateUserPlayerId', () => {
      const updateUserPlayerId = mutations.updateUserPlayerId;

      const state: PlayerState = {
        players: [],
        userPlayerId: '',
      };

      updateUserPlayerId(state, { playerId: 'foo' });
      expect(state.userPlayerId).toBe('foo');
    });
  });
});
