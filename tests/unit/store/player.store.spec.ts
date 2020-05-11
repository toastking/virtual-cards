import { app } from '@/db';
import { PlayerModule, Player } from '@/store/modules/player';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';
import { GameState } from '@/store/modules/game';
import { firestore } from 'firebase';

describe('Player Store Module', () => {
  const firebaseMock = exposeMockFirebaseApp(app);
  const actions = PlayerModule.actions!;

  beforeEach(() => {
    firebaseMock.firestore().mocker.reset(); // this will reset the whole database into an initial state
  });

  test('adds a player to firebase', async () => {
    const firestoreMock = firebaseMock.firestore().mocker;
    const player: Player = { name: 'foo' };
    const gameState: Partial<GameState> = { gameId: 'xyz' };
    const rootState = { game: gameState };
    const addPlayer = actions.addPlayer as Function;

    await addPlayer({ rootState }, player);
    const game = firestoreMock.collection('games').mocker.doc('xyz').mocker;
    const players = game.collection('players').mocker.getShallowCollection();

    expect(Object.values(players)).toEqual([player]);
  });
});
