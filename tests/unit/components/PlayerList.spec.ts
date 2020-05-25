import PlayerList from '@/components/PlayerList.vue';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import Buefy from 'buefy';
import { Store } from 'vuex-mock-store';
import { Player, Avatar, PlayerState, Game, GameState } from '@/store/state';

describe('PlayerList', () => {
  const player1: Player = { name: 'foo', id: 'currentId', avatar: Avatar.NONE };
  const player2: Player = { name: 'bar', avatar: Avatar.NONE };
  const playerState: Partial<PlayerState> = {
    players: [player1, player2],
    userPlayerId: 'currentId',
  };
  const gameDoc: Game = {
    gameCompleted: false,
    currentPlayer: '',
    gameStarted: true,
  };
  const game: Partial<GameState> = { game: gameDoc };
  const store = new Store({ state: { player: playerState, game } });
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
    const wrapper = mount(PlayerList, { mocks, localVue });
    expect(wrapper.element).toMatchSnapshot();
  });

  test('shows a tag for the current player turn', () => {
    store.state.game.game!.currentPlayer = 'currentId';
    const wrapper = shallowMount(PlayerList, { mocks, localVue });
    const firstPlayer = wrapper.findAll('.player-info').at(0);
    const tag = firstPlayer.find('.tag');

    expect(tag.exists()).toBe(true);
  });
});
