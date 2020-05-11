import { exposeMockFirebaseApp } from 'ts-mock-firebase';
import { app } from '@/db';
import { GameModule } from '@/store/modules/game';
import { createGame, setupGameBinding } from '@/store/action-types';
import { ActionHandler, Store, ActionContext, Action } from 'vuex';
import { CREATE_GAME_SUCCESS } from '@/store/mutation-types';

describe('Game Store Module', () => {
  const firebaseMock = exposeMockFirebaseApp(app);

  beforeEach(() => {
    firebaseMock.firestore().mocker.reset(); // this will reset the whole database into an initial state
  });

  test('should create new games', async () => {
    const createGameAction = GameModule.actions![createGame] as Function;
    const dispatch = jest.fn();

    await createGameAction({ dispatch });

    expect(dispatch).toHaveBeenCalledWith(setupGameBinding, expect.anything());
  });

  test.skip('should setup the game binding', async () => {
    const bindFirestoreRef = jest.fn();
    const setupGameBindingAction = (GameModule.actions![
      setupGameBinding
    ] as Function).bind({ bindFirestoreRef });
    const commit = jest.fn();
    const payload = { newGameId: 'foo' };

    await setupGameBindingAction({ commit }, payload);

    expect(commit).toHaveBeenCalledWith(CREATE_GAME_SUCCESS, payload);
  });
});
