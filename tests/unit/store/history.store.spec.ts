import { app } from '@/db';
import { GameState } from '@/store/modules/game';
import { HistoryEntry, HistoryModule } from '@/store/modules/history';
import { Player } from '@/store/modules/player';
import { firestore } from 'firebase';
import MockDate from 'mockdate';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';
describe('History Store Module', () => {
  const firebaseMock = exposeMockFirebaseApp(app);

  beforeEach(() => {
    jest.resetAllMocks();
    firebaseMock.firestore().mocker.reset(); // this will reset the whole database into an initial state
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

      const historyCollection = await firebaseMock
        .firestore()
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
