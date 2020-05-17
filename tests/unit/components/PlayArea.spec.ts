import PlayArea from '@/components/PlayArea.vue';
import { DeckState } from '@/store/modules/deck';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import VuePlayingCard from 'vue-playing-card';
import { Store } from 'vuex-mock-store';

describe('PlayArea', () => {
  const decks: DeckState['decks'] = [{ drawnCards: [] }];

  const store = new Store({
    getters: { gameOver: false, decks, isYourTurn: true, turnIsLoading: false },
  });
  // add other mocks here so they are accessible in every component
  const mocks = {
    $store: store,
  };

  const localVue = createLocalVue();
  localVue.use(VuePlayingCard);

  afterEach(() => {
    store.reset();
  });

  describe('snapshots', () => {
    test('show only the blank deck when there are no decks', () => {
      store.getters.decks = [];
      const wrapper = shallowMount(PlayArea, { mocks, localVue });
      expect(wrapper.element).toMatchSnapshot();
    });

    test('show a card when there is one', () => {
      store.getters.decks[0].drawnCards = ['4s'];
      store.getters.decks[0].currentCard = '4s';

      const wrapper = shallowMount(PlayArea, { mocks, localVue });
      expect(wrapper.element).toMatchSnapshot();
    });

    test('hide cards when the game is over', () => {
      store.getters.gameOver = true;

      const wrapper = shallowMount(PlayArea, { mocks, localVue });
      expect(wrapper.element).toMatchSnapshot();
    });
  });

  test('clicking the card draws a card', () => {
    const wrapper = shallowMount(PlayArea, { mocks, localVue });
    wrapper.find('.remaining-deck').trigger('click');
    expect(store.dispatch).toBeCalledWith('doTurn');
  });
});
