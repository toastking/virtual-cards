import App from '@/App.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import { Store } from 'vuex-mock-store';

describe('App', () => {
  const store = new Store({});
  // add other mocks here so they are accessible in every component
  const mocks = {
    $store: store,
  };
  const localVue = createLocalVue();
  localVue.use(VueRouter);

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    store.reset();
  });

  test('sets the current player id based on localstorage', () => {
    sessionStorage.setItem('playerId', 'xyz');
    shallowMount(App, { mocks, localVue });

    expect(store.commit).toHaveBeenCalledWith('updateUserPlayerId', {
      playerId: 'xyz',
    });
  });
});
