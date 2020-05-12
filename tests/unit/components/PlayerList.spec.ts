import PlayerList from '@/components/PlayerList.vue';
import { shallowMount, createLocalVue, mount } from '@vue/test-utils';
import { Store } from 'vuex-mock-store';
import Buefy from 'buefy';
import { PlayerState, Player } from '@/store/modules/player';

describe('PlayerList', () => {
  const player1: Player = { name: 'foo', id: 'currentId' };
  const player2: Player = { name: 'bar' };
  const playerState: Partial<PlayerState> = {
    players: [player1, player2],
    userPlayerId: 'currentId',
  };
  const store = new Store({ state: { player: playerState } });
  // add other mocks here so they are accessible in every component
  const mocks = {
    $store: store,
  };

  const localVue = createLocalVue();
  localVue.use(Buefy);

  afterEach(() => {
    store.reset();
  });

  test('renders the list of players from the store', () => {
    const wrapper = shallowMount(PlayerList, { mocks, localVue });
    const playerNames = wrapper.findAll('.player-name');

    expect(playerNames.at(0).text()).toBe('foo');
    expect(playerNames.at(1).text()).toBe('bar');
  });

  test('hightlights the users player card', () => {
    const wrapper = shallowMount(PlayerList, { mocks, localVue });
    const expectedHighlightedElement = wrapper
      .findAll('.player-card')
      .filter(elem => elem.find('.player-name').text() === 'foo')
      .at(0);

    expect(expectedHighlightedElement.classes()).toContain(
      'has-background-light'
    );
  });
});
