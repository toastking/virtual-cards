<template>
  <div class="container">
    <game-notification />
    <div class="game-container container is-fluid">
      <div class="columns">
        <div class="column is-three-fifths">
          <play-area></play-area>
          <game-buttons></game-buttons>
        </div>
        <div class="column is-two-fifths">
          <player-list></player-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import GameButtons from '@/components/GameButtons.vue';
import GameNotification from '@/components/GameNotification.vue';
import PlayArea from '@/components/PlayArea.vue';
import PlayerList from '@/components/PlayerList.vue';
import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  async mounted() {
    // Get the game ID from the route and set it in the store
    const gameId = this.$route.params.gameid;
    this.$store.commit('createGameSuccess', { newGameId: gameId });

    await this.$store.dispatch('setupGameBinding');
    this.$store.dispatch('setupDeckBinding');
    this.$store.dispatch('setupPlayerBinding');
  },
  methods: {
    ...mapActions([
      'setupDeckBinding',
      'setupGameBinding',
      'setupPlayerBinding',
    ]),
  },
  components: {
    'play-area': PlayArea,
    'game-buttons': GameButtons,
    'player-list': PlayerList,
    'game-notification': GameNotification,
  },
});
</script>

<style scoped>
.game-container {
  padding: 1em;
}
</style>