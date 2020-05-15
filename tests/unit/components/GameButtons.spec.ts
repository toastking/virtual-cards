import { Store } from 'vuex-mock-store';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Buefy from 'buefy';
import GameButtons from '@/components/GameButtons.vue';

describe('GameButtons', () => {
  const store = new Store({
    getters: { isYourTurn: false, turnIsLoading: false, gameOver: false },
  });

  const mocks = {
    $store: store,
  };

  const localVue = createLocalVue();
  localVue.use(Buefy);

  afterEach(() => {
    store.reset();
  });

  test('shows the button if it is your turn', () => {
    store.getters.isYourTurn = true;
    store.getters.gameOver = false;
    const wrapper = shallowMount(GameButtons, { mocks, localVue });

    expect(wrapper.find('#draw-card-button').exists()).toBe(true);
  });

  test('hides the button if its not the users turn', () => {
    store.getters.isYourTurn = false;
    const wrapper = shallowMount(GameButtons, { mocks, localVue });

    expect(wrapper.find('#draw-card-button').exists()).toBe(false);
  });

  test('hides the button if its game over', () => {
    store.getters.isYourTurn = true;
    store.getters.gameOver = true;
    const wrapper = shallowMount(GameButtons, { mocks, localVue });

    expect(wrapper.find('#draw-card-button').exists()).toBe(false);
  });
});
