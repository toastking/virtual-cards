import { firestore } from 'firebase';

/** A Player's icon */
export enum Avatar {
  NONE,
  ALPACA,
  BUFALLO,
  GIRAFFE,
  OTTER,
  SHEEP,
}

/** Player in the game */
export interface Player {
  name: string;
  avatar: Avatar;
  id?: string;
}

/** State for current players in a game */
export interface PlayerState {
  players: Player[];
  /** The player id for the current user */
  userPlayerId: string;
}

/** Represents loading state so we can show loading spinners */
export enum LoadingStatus {
  NOT_STARTED,
  LOADING,
  OK,
  ERROR,
}

/** Represents the general state of a card game */
export interface Game {
  currentPlayer: string | null;
  gameCompleted: boolean;
  gameStarted: boolean;
}

export interface GameState {
  gameId: string | null;
  gameLoadingStatus: LoadingStatus;
  game: Game;
  // Loading for the request for the turn
  turnLoadingState: LoadingStatus;
}

/** A record of what card was drawn by what user */
export interface HistoryEntry {
  playerId: string;
  /** String representation of a card based on vue-plaing-card */
  card: string;
  timestamp: firestore.Timestamp;
}

/** State for which card was drawn and when */
export interface HistoryState {
  history: HistoryEntry[] | null;
}

/** Reprents a pile of cards, for something like kings */
export interface Deck {
  drawnCards: string[];
  currentCard?: string;
  id?: string; // Id from firestore
}

/** Frontend store state for drawn cards in a game */
export interface DeckState {
  decks: Deck[];
  currentDeckIndex: number;
}
