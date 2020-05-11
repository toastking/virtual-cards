import { app } from '@/db';
import { GameModule } from '@/store/modules/game';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';
import { CREATE_GAME_SUCCESS } from '@/store/mutation-types';

describe.only('Game Store Module', () => {
  const firebaseMock = exposeMockFirebaseApp(app);
  const actions = GameModule.actions!;

  beforeEach(() => {
    firebaseMock.firestore().mocker.reset(); // this will reset the whole database into an initial state
  });

  test('should create new game object then add the host player', async () => {
    const createGameAction = actions.createGame as Function;
    const dispatch = jest.fn();
    const commit = jest.fn();

    await createGameAction({ dispatch, commit }, { hostPlayerName: 'foo' });
    expect(dispatch).toHaveBeenCalledWith('addPlayer', { name: 'foo' });
    expect(commit).toHaveBeenCalledWith(CREATE_GAME_SUCCESS, {
      newGameId: expect.any(String),
    });
    expect(dispatch).toHaveBeenCalledWith('routeToLobby', {
      newGameId: expect.any(String),
    });
  });
});
