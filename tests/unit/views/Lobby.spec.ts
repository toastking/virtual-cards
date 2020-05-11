import { Store } from 'vuex-mock-store';
import { shallowMount } from '@vue/test-utils';
import Lobby from '@/views/Lobby.vue';

describe.only('Lobby View', () => {
  const store = new Store({});
  // add other mocks here so they are accessible in every component
  const mocks = {
    $store: store,
  };

  afterEach(() => {
    store.reset();
  });

  test('dispatches actions to bind the state on load', () => {
    shallowMount(Lobby, { mocks });
    expect(store.dispatch).toHaveBeenCalledWith('setupGameBinding');
    expect(store.dispatch).toHaveBeenCalledWith('setupPlayerBinding');
  });
});
