import { db } from '@/db';
import { DeckModule } from '@/store/modules/deck';
import { Avatar, Deck, DeckState, GameState, Player } from '@/store/state';
import * as firebase from '@firebase/testing';
import { firestore } from 'firebase';

jest.mock('@/db');

describe('Deck Store Module', () => {
  beforeEach(() => {
    firebase.clearFirestoreData({ projectId: 'remote-cards' });
  });

  describe('actions', () => {
    const actions = DeckModule.actions!;
    const gameState: Partial<GameState> = { gameId: 'xyz' };
    const rootState = { game: gameState };

    test('addDeck', async () => {
      await db
        .collection('games')
        .doc('xyz')
        .set({});

      const addDeck = actions.addDeck as Function;

      await addDeck({ rootState });

      // Set the deck
      const decks = (
        await db
          .collection('games')
          .doc('xyz')
          .collection('decks')
          .get()
      ).docs;
      expect(Object.values(decks).length).toBe(1);
    });

    test('drawCard', async () => {
      const drawCard = actions.drawCard as Function;

      // Setup firestore
      await db
        .collection('games')
        .doc('xyz')
        .set({});
      await db
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

      const newDeckRef = await db
        .collection('games')
        .doc('xyz')
        .collection('decks')
        .doc('deck1')
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
      await db
        .collection('games')
        .doc('xyz')
        .set({ gameCompleted: false });
      await db
        .collection('games')
        .doc('xyz')
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

      const gameRef = await db
        .collection('games')
        .doc('xyz')
        .get();

      const updatedGame = gameRef.data();

      expect(updatedGame!.gameCompleted).toBe(true);
    });

    test('restartGame', async () => {
      const restartGame = actions.restartGame as Function;

      // Setup firestore
      await db
        .collection('games')
        .doc('xyz')
        .set({ gameCompleted: false });

      await db
        .collection('games')
        .doc('xyz')
        .collection('decks')
        .doc('deck1')
        .set({ drawnCards: ['as'], currentCard: 'as' });

      await restartGame({ rootState });

      const decksRef = await db
        .collection('games')
        .doc('xyz')
        .collection('decks')
        .get();
      const deck = decksRef.docs[0].data() as Deck;

      expect(Object.values(deck.drawnCards).length).toBe(0);
      expect(deck.currentCard).toBeUndefined();
    });
  });
});
