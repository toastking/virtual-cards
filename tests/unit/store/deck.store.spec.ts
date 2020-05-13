import { exposeMockFirebaseApp } from 'ts-mock-firebase';
import { DeckModule } from '@/store/modules/deck';
import { app } from '@/db';
import { GameState } from '@/store/modules/game';

describe('Deck Store Module', () => {
  const firebaseMock = exposeMockFirebaseApp(app);

  beforeEach(() => {
    firebaseMock.firestore().mocker.reset(); // this will reset the whole database into an initial state
  });

  describe('actions', () => {
    const actions = DeckModule.actions!;
    const gameState: Partial<GameState> = { gameId: 'xyz' };
    const rootState = { game: gameState };

    test('addDeck', async () => {
      firebaseMock.firestore().mocker.loadCollection('games', { xyz: {} });
      const addDeck = actions.addDeck as Function;

      await addDeck({ rootState });

      const decks = firebaseMock
        .firestore()
        .mocker.collection('games')
        .mocker.doc('xyz')
        .mocker.collection('decks')
        .mocker.getShallowCollection();

      expect(Object.values(decks).length).toBe(1);
    });

    test('setupDeckForGame', async () => {
      const setupDecksForGame = actions.setupDecksForGame as Function;
      const dispatch = jest.fn();

      await setupDecksForGame({ rootState, dispatch });

      expect(dispatch).toHaveBeenCalledWith('addDeck');
      expect(dispatch).toHaveBeenCalledWith('setupDeckBinding');
    });
  });
});
