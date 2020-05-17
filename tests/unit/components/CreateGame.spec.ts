import CreateGame from '@/components/CreateGame.vue';
import { Avatar } from '@/store/modules/player';
import { createLocalVue, mount } from '@vue/test-utils';
import Buefy from 'buefy';
import Vue from 'vue';
import VueRouter from 'vue-router';
import { Store } from 'vuex-mock-store';

describe('CreateGame Component', () => {
  const store = new Store({});

  // add other mocks here so they are accessible in every component
  const mocks = {
    $store: store,
  };

  const localVue = createLocalVue();
  localVue.use(VueRouter);
  localVue.use(Buefy);

  const router = new VueRouter({
    routes: [
      { path: '/', component: CreateGame },
      { path: '/start/:gameid', component: CreateGame },
    ],
  });

  test('the Create Game button calls the action', () => {
    const component = mount(CreateGame, { mocks, localVue, router });
    component.setData({ playerName: 'hello' });
    component.find('#create-game-button').trigger('click');
    expect(store.dispatch).toHaveBeenCalledWith('createGame', {
      hostPlayerName: 'hello',
      avatar: Avatar.NONE,
    });
  });

  test('the join game button calls the joingame action', () => {
    const component = mount(CreateGame, { mocks, localVue, router });
    component.setData({ playerName: 'hello', gameId: 'xyz' });
    component.find('#join-game-button').trigger('click');
    expect(store.dispatch).toHaveBeenCalledWith('joinGame', {
      playerName: 'hello',
      gameId: 'xyz',
      avatar: Avatar.NONE,
    });
  });

  test('fills in the gameid if it exists in the route', async () => {
    router.push('/start/foo');
    const wrapper = mount(CreateGame, { mocks, localVue, router });
    await Vue.nextTick();
    expect(wrapper.vm.$data.gameId).toBe('foo');
    expect(
      (wrapper.find('#game-field').element as HTMLInputElement).value
    ).toBe('foo');
  });
});
