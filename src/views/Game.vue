<template>
  <div class="colums">
    <div class="column is-three-quartes">
      <play-area></play-area>
      <game-buttons></game-buttons>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PlayArea from '@/components/PlayArea.vue';
import GameButtons from '@/components/GameButtons.vue';
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
  components: { 'play-area': PlayArea, 'game-buttons': GameButtons },
});
</script>
