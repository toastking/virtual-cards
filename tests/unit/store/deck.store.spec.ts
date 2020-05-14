import { exposeMockFirebaseApp } from 'ts-mock-firebase';
import { DeckModule, Deck, DeckState } from '@/store/modules/deck';
import { app } from '@/db';
import { GameState, Game, GameModule } from '@/store/modules/game';
import store from '@/store';
import { firebaseAction } from 'vuexfire/dist/packages/vuexfire/src';

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
