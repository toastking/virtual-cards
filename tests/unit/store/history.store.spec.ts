import { db } from '@/db';
import { HistoryModule } from '@/store/modules/history';
import { GameState, HistoryEntry, Player } from '@/store/state';
import * as firebase from '@firebase/testing';
import MockDate from 'mockdate';

jest.mock('@/db');

describe('History Store Module', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    firebase.clearFirestoreData({
      projectId: 'remote-cards',
    });
  });

  describe('actions', () => {
    const actions = HistoryModule.actions!;
    const gameState: Partial<GameState> = { gameId: 'xyz' };
    const rootState = { game: gameState };

    test('addHistory', async () => {
      const player: Partial<Player> = { id: 'id1' };
      const card = '4s';
      const addHistory = actions.addHistory as Function;
      MockDate.set(Date.UTC(2020, 17, 5));

      await addHistory({ rootState }, { player, card });

      const historyCollection = await db
        .collection('games')
        .doc('xyz')
        .collection('history')
        .get();

      const expectedHistory: Partial<HistoryEntry> = {
        card: '4s',
        playerId: 'id1',
      };

      expect(historyCollection.docs[0].data()).toEqual(
        expect.objectContaining(expectedHistory)
      );
    });
  });
});
