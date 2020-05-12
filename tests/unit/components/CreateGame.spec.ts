import { Store } from 'vuex-mock-store';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import CreateGame from '@/components/CreateGame.vue';
import Buefy from 'buefy';

describe('CreateGame Component', () => {
  const store = new Store({});

  // add other mocks here so they are accessible in every component
  const mocks = {
    $store: store,
  };

  const localVue = createLocalVue();
  localVue.use(Buefy);

  test('the Create Game button calls the action', () => {
    const component = mount(CreateGame, { mocks, localVue });
    component.setData({ playerName: 'hello' });
    component.find('#create-game-button').trigger('click');
    expect(store.dispatch).toHaveBeenCalledWith('createGame', {
      hostPlayerName: 'hello',
    });
  });

  test('the join game button calls the joingame action', () => {
    const component = mount(CreateGame, { mocks, localVue });
    component.setData({ playerName: 'hello', gameId: 'xyz' });
    component.find('#join-game-button').trigger('click');
    expect(store.dispatch).toHaveBeenCalledWith('joinGame', {
      playerName: 'hello',
      gameId: 'xyz',
    });
  });
});
