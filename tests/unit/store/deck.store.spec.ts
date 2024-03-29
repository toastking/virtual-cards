import { app } from '@/db';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';
import { firestore } from 'firebase';
import { DeckModule } from '@/store/modules/deck';
import { GameState, DeckState, Player, Avatar, Deck } from '@/store/state';

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

      // Setup firestore
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
        cardsStillLeft: ['sa'],
        currentDeck: state.decks![0],
      };
      const mockPlayer: Player = {
        avatar: Avatar.NONE,
        name: 'foo',
        id: 'id1',
      };
      const rootGetters = { currentPlayer: mockPlayer };
      const dispatch = jest.fn();

      await drawCard({ state, rootState, getters, rootGetters, dispatch });

      const newDeckRef = await firebaseMock
        .firestore()
        .doc('games/xyz/decks/deck1')
        .get();

      const newDeck = newDeckRef.data();

      expect(newDeck!.drawnCards.length).toBe(1);
      expect(newDeck!.currentCard).toEqual(expect.any(String));

      // Check we added to the history
      expect(dispatch).toHaveBeenCalledWith('addHistory', {
        card: 'sa',
        player: mockPlayer,
      });
    });

    test('drawCard changes the game to ended', async () => {
      const drawCard = actions.drawCard as Function;

      // Setup firestore
      firebaseMock.firestore().mocker.loadCollection('games', {
        xyz: {},
      });
      firebaseMock
        .firestore()
        .doc('games/xyz')
        .set({ gameCompleted: false });

      firebaseMock
        .firestore()
        .doc('games/xyz')
        .collection('decks')
        .doc('deck1')
        .set({ drawnCards: [] });

      const state: Partial<DeckState> = {
        currentDeckIndex: 0,
        decks: [{ drawnCards: new Array(51), id: 'deck1' }],
      };
      const getters = {
        cardsStillLeft: ['sa'],
        currentDeck: state.decks![0],
      };

      await drawCard({ state, rootState, getters });

      const gameRef = await firebaseMock
        .firestore()
        .doc('games/xyz')
        .get();

      const updatedGame = gameRef.data();

      expect(updatedGame!.gameCompleted).toBe(true);
    });

    test('restartGame', async () => {
      const restartGame = actions.restartGame as Function;

      // Setup firestore
      firebaseMock.firestore().mocker.loadCollection('games', {
        xyz: {},
      });
      firebaseMock
        .firestore()
        .doc('games/xyz')
        .set({ gameCompleted: false });

      firebaseMock
        .firestore()
        .doc('games/xyz')
        .collection('decks')
        .doc('deck1')
        .set({ drawnCards: ['as'], currentCard: 'as' });

      await restartGame({ rootState });

      const decksRef = await firebaseMock
        .firestore()
        .doc('games/xyz')
        .collection('decks')
        .get();
      const deck = decksRef.docs[0].data() as Deck;

      expect(Object.values(deck.drawnCards).length).toBe(0);
      expect(deck.currentCard).toEqual(firestore.FieldValue.delete());
    });
  });
});
