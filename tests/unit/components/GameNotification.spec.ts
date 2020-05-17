import GameNotification from '@/components/GameNotification.vue';
import { createLocalVue, mount } from '@vue/test-utils';
import Buefy from 'buefy';
import { Store } from 'vuex-mock-store';

describe('GameNotification', () => {
  const store = new Store({ getters: { isYourTurn: false, gameOver: false } });
  // add other mocks here so they are accessible in every component
  const mocks = {
    $store: store,
  };

  const localVue = createLocalVue();
  localVue.use(Buefy);

  afterEach(() => {
    store.reset();
  });

  describe('snapshots', () => {
    test('shows nothing when its not the players turn', () => {
      store.getters.isYourTurn = false;
      store.getters.gameOver = false;
      const wrapper = mount(GameNotification, { mocks, localVue });
      expect(wrapper.element).toMatchSnapshot();
    });

    test('show player banner when it is their turn', () => {
      store.getters.isYourTurn = true;
      const wrapper = mount(GameNotification, { mocks, localVue });
      expect(wrapper.element).toMatchSnapshot();
    });

    test('shows game over banner when the game is over', () => {
      store.getters.isYourTurn = false;
      store.getters.gameOver = true;
      const wrapper = mount(GameNotification, { mocks, localVue });
      expect(wrapper.element).toMatchSnapshot();
    });
  });

  test('dispatches restart game action', () => {
    store.getters.gameOver = true;
    const wrapper = mount(GameNotification, { mocks, localVue });
    wrapper.find('#new-game-button').trigger('click');
    expect(store.dispatch).toHaveBeenCalledWith('restartGame');
  });
});
