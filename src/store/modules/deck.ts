import { Module } from 'vuex';
import { State } from '@/store';
import { firestoreAction } from 'vuexfire';
import { db } from '@/db';

interface Deck {
  drawnCards: string[];
}

interface DeckState {
  decks: Deck[];
}

const baseDeck = createInitialDeck();

export const DeckModule: Module<DeckState, State> = {
  state: () => ({ decks: [] }),
  actions: {
    /** Add a deck to firebase */
    addDeck({ rootState }) {
      const { gameId } = rootState.game;
      if (gameId) {
        const newDeck: Deck = { drawnCards: [] };
        return db
          .collection('games')
          .doc(gameId)
          .collection('decks')
          .add(newDeck);
      }
    },
    /** Adds an initial deck and sets up the deck binding to firebase */
    async setupDecksForGame({ rootState, dispatch }) {
      const { gameId } = rootState.game;
      if (gameId) {
        await dispatch('addDeck');
        dispatch('setupDeckBinding');
      }
    },
    setupDeckBinding: firestoreAction(({ rootState, bindFirestoreRef }) => {
      const { gameId } = rootState.game;
      if (gameId) {
        return bindFirestoreRef(
          'decks',
          db
            .collection('games')
            .doc(gameId)
            .collection('decks')
        );
      }
    }),
  },
};

/** Make the initial deck value */
function createInitialDeck(): string[] {
  const ranks = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];
  const suits = ['c', 'd', 'h', 's'];
  const deck: string[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(`${rank}${suit}`);
    }
  }
  return deck;
}
