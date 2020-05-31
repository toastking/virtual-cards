import { db } from '@/db';
import { PlayerModule } from '@/store/modules/player';
import { Avatar, GameState, Player, PlayerState } from '@/store/state';
import * as firebase from '@firebase/testing';

jest.mock('@/db');

describe('Player Store Module', () => {
  const actions = PlayerModule.actions!;

  afterEach(() => {
    jest.resetAllMocks();
    firebase.clearFirestoreData({ projectId: 'remote-cards' });
  });

  describe('actions', () => {
    test('addPlayer', async () => {
      const player: Player = { name: 'foo', avatar: Avatar.NONE };
      const gameState: Partial<GameState> = { gameId: 'xyz' };
      const rootState = { game: gameState };
      const addPlayer = actions.addPlayer as Function;

      await addPlayer({ rootState }, player);
      const game = db.collection('games').doc('xyz');
      const players = await game.collection('players').get();

      expect(players.docs[0].data()).toEqual(player);
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
      db.doc('games/xyz').set({ currentPlayer: 'id1' });

      await nextPlayer({ state, rootState });

      const updatedGame = await db.doc('games/xyz').get();
      expect(updatedGame.data()!.currentPlayer).toBe('id2');
    });

    test('changePlayerName', async () => {
      const player: Player = { id: 'id', name: 'foo', avatar: Avatar.NONE };

      // Add the game
      await db
        .collection('games')
        .doc('xyz')
        .set({});
      // Add the players list
      await db
        .collection('games')
        .doc('xyz')
        .collection('players')
        .doc('id')
        .set(player);

      const changePlayerName = actions.changePlayerName as Function;
      const getters = { userPlayer: player };
      const rootState = { game: { gameId: 'xyz' } };

      await changePlayerName({ getters, rootState }, 'tony');

      const updatedPlayer = (
        await db
          .collection('games')
          .doc('xyz')
          .collection('players')
          .doc('id')
          .get()
      ).data();

      expect(updatedPlayer!.name).toBe('tony');
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
