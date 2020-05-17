<template>
  <ol class="history-list list">
    <li
      class="list-item has-text-left"
      v-for="entry of historyWithPlayerInfo"
      :key="entry.card"
    >
      <span class="has-text-info">{{ entry.player.name }} </span> drew
      <span class="history-card-info">{{ cardToEmoji(entry.card) }}</span>
      <span class="has-text-grey-light">{{
        prettyPrintTime(entry.timestamp)
      }}</span>
    </li>
  </ol>
</template>

<script lang="ts">
import { State } from '@/store';
import { parse } from 'playing-card-signature';
import Vue from 'vue';
import { mapGetters, mapState, mapActions } from 'vuex';
import { firestore } from 'firebase';
import moment from 'moment';

export default Vue.extend({
  computed: {
    ...mapGetters(['historyWithPlayerInfo']),
  },
  methods: {
    cardToEmoji(card: string) {
      const parsed = parse(card);
      const emojiMapping = { s: '♠️', h: '♥️', c: '♣️', d: '♦️' };
      return `${parsed.rank}${emojiMapping[parsed.suit]}`;
    },
    prettyPrintTime(timestamp: firestore.Timestamp) {
      return moment(timestamp.toDate()).fromNow();
    },
  },
});
</script>

<style scoped>
.history-list {
  height: 25em;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

/* Set the font to system font to display emoji properly*/
.history-card-info {
  font-family: sans-serif;
}
</style>
