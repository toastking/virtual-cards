import { Store } from 'vuex-mock-store';
import { shallowMount, createLocalVue, mount } from '@vue/test-utils';
import Lobby from '@/views/Lobby.vue';
import VueRouter from 'vue-router';
import Buefy from 'buefy';

describe('Lobby View', () => {
  const store = new Store({
    state: { game: { game: { gameStarted: false } }, player: { players: [] } },
  });

  const localVue = createLocalVue();
  localVue.use(VueRouter);
  localVue.use(Buefy);

  const router = new VueRouter({
    routes: [
      {
        path: '/lobby/:gameid',
        name: 'lobby',
        component: Lobby,
      },
    ],
  });

  // add other mocks here so they are accessible in every component
  const mocks = {
    $store: store,
  };

  afterEach(() => {
    store.reset();
  });

  test('dispatches actions to bind the state on load', () => {
    shallowMount(Lobby, { mocks, localVue, router });
    expect(store.dispatch).toHaveBeenCalledWith('setupGameBinding');
    expect(store.dispatch).toHaveBeenCalledWith('setupPlayerBinding');
  });

  test('sets the game id based on the router', () => {
    router.push('/lobby/xyz');
    shallowMount(Lobby, { mocks, localVue, router });
    expect(store.commit).toHaveBeenCalledWith('createGameSuccess', {
      newGameId: 'xyz',
    });
  });

  test('routes to the game when the game is started ', () => {
    shallowMount(Lobby, { mocks, localVue, router });
    store.state.game.game.gameStarted = true;
    expect(store.dispatch).toHaveBeenCalledWith('routeToGame');
  });

  test('starts the game when Start Game is clicked', () => {
    const wrapper = mount(Lobby, { mocks, localVue, router });
    wrapper.find('#start-game-button').trigger('click');
    expect(store.dispatch).toHaveBeenCalledWith('startGame');
  });
});
