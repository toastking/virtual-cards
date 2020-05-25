import functTest from 'firebase-functions-test';
import { FeaturesList } from 'firebase-functions-test/lib/features';
import { Player, Avatar, Game, Deck } from '../../src/store/state';
import { setupGame } from '../src/index';
import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

describe('Game Setup', () => {
  let test: FeaturesList;
  beforeAll(() => {
    test = functTest(
      {
        databaseURL: 'https://remote-cards.firebaseio.com',
        storageBucket: 'remote-cards.appspot.com',
        projectId: 'remote-cards',
      },
      'serviceAccount.json'
    );
  });

  afterEach(() => {
    test.cleanup();
  });

  it('should setup the game', async () => {
    const hostPlayer: Player = { name: 'mort', avatar: Avatar.ALPACA };
    const req = { body: hostPlayer } as functions.Request;
    const resp = { send: jest.fn() };
    // tslint:disable-next-line: no-void-expression
    await setupGame(req, (resp as unknown) as functions.Response);
    expect(resp.send).toHaveBeenCalledWith(expect.any(String));

    const gameId = resp.send.mock.calls[0][0];
    const game = await admin
      .firestore()
      .collection('games')
      .doc(gameId);
    const expectedGame: Game = {
      currentPlayer: null,
      gameCompleted: false,
      gameStarted: false,
    };
    expect((await game.get()).data()).toEqual(expectedGame);

    // Check the host player is added correctly
    const players = game.collection('players');
    expect((await players.get()).docs[0].data()).toEqual(hostPlayer);

    //Check the decks are initialized properly
    const expectedDeck: Deck = { drawnCards: [] };
    const decks = game.collection('decks');
    expect((await decks.get()).docs[0].data()).toEqual(expectedDeck);
  });
});
