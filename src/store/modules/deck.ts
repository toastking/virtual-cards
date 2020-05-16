import { Module } from 'vuex';
import { State } from '@/store';
import { firestoreAction } from 'vuexfire';
import { db } from '@/db';
import { Game } from './game';

export interface Deck {
  drawnCards: string[];
  currentCard?: string;
  id?: string; // Id from firestore
}

export interface DeckState {
  decks: Deck[];
  currentDeckIndex: number;
}

const baseDeck = createInitialDeck();

export const DeckModule: Module<DeckState, State> = {
  state: () => ({ decks: [], currentDeckIndex: 0 }),
  actions: {
    /** Draw a random card from a deck in the game */
    drawCard({ rootState, getters }) {
      // Get the drawn cards for the current deck
      const availableCards: string[] = getters.cardsStillLeft;
      const cardIndex = Math.floor(Math.random() * availableCards.length);
      const drawnCard = availableCards[cardIndex];
      const currentDeck: Deck = getters.currentDeck;
      const updatedDrawnCards = currentDeck.drawnCards.concat(drawnCard);

      // update the Deck value in firestore
      const { gameId } = rootState.game;
      if (gameId) {
        // Check if the game is over
        const gameFinished = updatedDrawnCards.length === 52;
        if (gameFinished) {
          const updatedGame: Partial<Game> = { gameCompleted: true };
          return db
            .collection('games')
            .doc(gameId)
            .update(updatedGame);
        } else {
          // Update the card and drawn cards for the current deck
          const fieldsToUpdate: Partial<Deck> = {
            currentCard: drawnCard,
            drawnCards: updatedDrawnCards,
          };
          return db
            .collection('games')
            .doc(gameId)
            .collection('decks')
            .doc(currentDeck.id)
            .update(fieldsToUpdate);
        }
      }
    },
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
    /** Resets the deck when the game is over and we need to restart the game */
    async restartGame({ rootState }) {
      const { gameId } = rootState.game;
      if (gameId) {
        const decksRef = db
          .collection('games')
          .doc(gameId)
          .collection('decks');
        const deckDocuments = await decksRef.get();

        const batch = db.batch();

        deckDocuments.forEach(deck => {
          const updatedDeck: Partial<Deck> = {
            currentCard: undefined,
            drawnCards: [],
          };
          batch.update(decksRef.doc(deck.id), updatedDeck);
        });

        batch.commit();
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
  getters: {
    /** Calculate the cards still left to draw in a given deck */
    cardsStillLeft(state): string[] {
      const drawnCards = new Set(
        state.decks[state.currentDeckIndex].drawnCards
      );
      return baseDeck.filter(card => !drawnCards.has(card));
    },
    /** Get the current deck we're working on */
    currentDeck(state): Deck {
      return state.decks[state.currentDeckIndex];
    },
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
    'T',
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
