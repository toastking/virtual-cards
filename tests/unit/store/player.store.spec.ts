import { app } from '@/db';
import { PlayerModule, Player, PlayerState } from '@/store/modules/player';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';
import { GameState } from '@/store/modules/game';
import { firestore } from 'firebase';

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
      const player: Player = { name: 'foo' };
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
      const mockPlayer: Player = { name: 'foo' };

      await addUserPlayer({ commit, dispatch }, mockPlayer);

      expect(dispatch).toHaveBeenCalledWith('addPlayer', mockPlayer);
      expect(commit).toHaveBeenCalledWith('updateUserPlayerId', {
        playerId: 'xyz',
      });
    });

    test('storePlayerId', async () => {
      const storePlayerId = actions.storePlayerId as Function;

      await storePlayerId({}, { playerId: 'foo' });
      expect(sessionStorage.setItem).toBeCalledWith('playerId', 'foo');
    });
  });

  describe('mutations', () => {
    const mutations = PlayerModule.mutations!;

    test('updateUserPlayerId', () => {
      const updateUserPlayerId = mutations.updateUserPlayerId;

      const state: PlayerState = { players: [], userPlayerId: '' };

      updateUserPlayerId(state, { playerId: 'foo' });
      expect(state.userPlayerId).toBe('foo');
    });
  });
});
