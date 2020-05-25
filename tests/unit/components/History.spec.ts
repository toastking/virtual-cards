import History from '@/components/History.vue';
import { Avatar, HistoryEntry, Player } from '@/store/state';
import { mount } from '@vue/test-utils';
import { firestore } from 'firebase';
import MockDate from 'mockdate';
import { Store } from 'vuex-mock-store';

describe('History', () => {
  const histories: Array<HistoryEntry & { player: Player }> = [];
  const store = new Store({ getters: { historyWithPlayerInfo: histories } });
  // add other mocks here so they are accessible in every component
  const mocks = {
    $store: store,
  };

  afterEach(() => {
    store.reset();
  });

  describe('snapshots', () => {
    beforeEach(() => {
      MockDate.set(Date.UTC(2020, 5, 17, 16, 30));
    });

    test('empty list', () => {
      store.getters.historyWithPlayerInfo = [];
      const wrapper = mount(History, { mocks });
      expect(wrapper.element).toMatchSnapshot();
    });

    test('a few history elements', () => {
      const mockHistory: Array<HistoryEntry & { player: Player }> = [
        {
          card: '4s',
          player: { avatar: Avatar.ALPACA, name: 'mort' },
          playerId: 'id',
          timestamp: firestore.Timestamp.fromDate(
            new Date(Date.UTC(2020, 5, 17, 18, 29))
          ),
        },
        {
          card: '5h',
          player: { avatar: Avatar.ALPACA, name: 'stove' },
          playerId: 'id',
          timestamp: firestore.Timestamp.fromDate(
            new Date(Date.UTC(2020, 5, 17, 18, 26))
          ),
        },
      ];
      store.getters.historyWithPlayerInfo = mockHistory;

      const wrapper = mount(History, { mocks });
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
