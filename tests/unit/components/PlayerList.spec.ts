import PlayerList from '@/components/PlayerList.vue';
import { Game, GameState } from '@/store/modules/game';
import { Player, PlayerState } from '@/store/modules/player';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Buefy from 'buefy';
import { Store } from 'vuex-mock-store';

describe('PlayerList', () => {
  const player1: Player = { name: 'foo', id: 'currentId' };
  const player2: Player = { name: 'bar' };
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
    const wrapper = shallowMount(PlayerList, { mocks, localVue });
    const playerNames = wrapper.findAll('.player-name');

    expect(playerNames.at(0).text()).toBe('foo');
    expect(playerNames.at(1).text()).toBe('bar');
  });

  test('shows a tag for the current player turn', () => {
    store.state.game.game!.currentPlayer = 'currentId';
    const wrapper = shallowMount(PlayerList, { mocks, localVue });
    const firstPlayer = wrapper.findAll('.player-info').at(0);
    const tag = firstPlayer.find('.tag');

    expect(tag.exists()).toBe(true);
  });
});
