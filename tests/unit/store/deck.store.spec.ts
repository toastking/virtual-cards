import { app } from '@/db';
import { DeckModule, DeckState } from '@/store/modules/deck';
import { GameState } from '@/store/modules/game';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';

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

    test('drawCard', async () => {
      const drawCard = actions.drawCard as Function;

      //Setup firestore
      firebaseMock.firestore().mocker.loadCollection('games', {
        xyz: {},
      });
      firebaseMock
        .firestore()
        .doc('games/xyz')
        .collection('decks')
        .doc('deck1')
        .set({ drawnCards: [] });

      const state: Partial<DeckState> = {
        currentDeckIndex: 0,
        decks: [{ drawnCards: [], id: 'deck1' }],
      };
      const getters = {
        cardsStillLeft: jest.fn().mockReturnValue(['sa']),
        currentDeck: jest.fn().mockReturnValue(state.decks![0]),
      };

      await drawCard({ state, rootState, getters });

      const newDeckRef = await firebaseMock
        .firestore()
        .doc('games/xyz/decks/deck1')
        .get();

      const newDeck = newDeckRef.data();

      expect(newDeck!.drawnCards.length).toBe(1);
      expect(newDeck!.currentCard).toEqual(expect.any(String));
    });
  });
});
