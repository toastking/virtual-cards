<template>
  <div class="container">
    <game-notification />
    <div class="game-container container is-fluid">
      <div class="columns">
        <div class="column is-three-fifths">
          <play-area />
          <history class="history" />
        </div>
        <div class="column is-two-fifths">
          <player-list></player-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import GameNotification from '@/components/GameNotification.vue';
import History from '@/components/History.vue';
import PlayArea from '@/components/PlayArea.vue';
import PlayerList from '@/components/PlayerList.vue';
import Vue from 'vue';
import { mapActions, mapMutations, mapState } from 'vuex';

export default Vue.extend({
  async mounted() {
    // Get the game ID from the route and set it in the store
    const gameId = this.$route.params.gameid;
    this.createGameSuccess({ newGameId: gameId });

    await this.setupGameBinding();
    this.setupDeckBinding();
    this.setupPlayerBinding();
    this.setupHistoryBinding();
  },
  methods: {
    ...mapActions([
      'setupDeckBinding',
      'setupGameBinding',
      'setupPlayerBinding',
      'setupHistoryBinding',
    ]),
    ...mapMutations(['createGameSuccess']),
  },
  components: {
    'play-area': PlayArea,
    'player-list': PlayerList,
    'game-notification': GameNotification,
    history: History,
  },
});
</script>

<style scoped>
.game-container {
  padding: 1em;
}

.history {
  margin-top: 1em;
}
</style>
