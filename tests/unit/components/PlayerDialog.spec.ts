import PlayerDialog from '@/components/PlayerDialog.vue';
import { Avatar, Player, PlayerState } from '@/store/modules/player';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import Buefy from 'buefy';
import Vue from 'vue';
import { Store } from 'vuex-mock-store';

describe('PlayerDialog', () => {
  const playerState: Partial<PlayerState> = { userPlayerId: 'playerid' };
  const store = new Store({
    state: { player: playerState },
  });
  // add other mocks here so they are accessible in every component
  const mocks = {
    $store: store,
  };

  const localVue = createLocalVue();
  localVue.use(Buefy);

  afterEach(() => {
    jest.resetAllMocks();
    store.reset();
  });

  test('shows the player edit mode for the logged in user', () => {
    const mockPlayer: Player = {
      avatar: Avatar.BUFALLO,
      name: 'sean',
      id: 'playerid',
    };
    const wrapper = shallowMount(PlayerDialog, {
      propsData: { player: mockPlayer },
      localVue,
      mocks,
    });

    expect(wrapper.find('#change-player-name-form').exists()).toBe(true);
  });

  test('sends out an action to update the player name', async () => {
    const mockPlayer: Player = {
      avatar: Avatar.BUFALLO,
      name: 'sean',
      id: 'playerid',
    };
    const wrapper = mount(PlayerDialog, {
      propsData: { player: mockPlayer },
      localVue,
      mocks,
    });

    const mockClose = jest.fn();
    wrapper.setMethods({ closeDialog: mockClose });

    const playerNameInput = wrapper.find('#new-player-name-input');
    playerNameInput.setValue('mort');

    await Vue.nextTick();

    wrapper.find('#change-player-name-button').trigger('click');

    expect(store.dispatch).toHaveBeenCalledWith('changePlayerName', 'mort');
    expect(mockClose).toHaveBeenCalled();
  });
});
