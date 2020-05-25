import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import { Game, Deck, Player } from '../../src/store/state';

admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const setupGame = functions.https.onRequest(
  async (request, response) => {
    const newGame: Game = {
      currentPlayer: null,
      gameCompleted: false,
      gameStarted: false,
    };
    const game = await admin
      .firestore()
      .collection('games')
      .add(newGame);

    // Add the player
    const playerToAdd: Player = request.body;
    await game.collection('players').add(playerToAdd);

    // Initialize the deck
    const newDeck: Deck = { drawnCards: [] };
    await game.collection('decks').add(newDeck);

    //Send back the game id
    return response.send(game.id);
  }
);
