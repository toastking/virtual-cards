<template>
  <player-list />
</template>
<script lang="ts">
// Lobby to show players
import Vue from 'vue';
import PlayerList from '../components/PlayerList.vue';
import { mapState } from 'vuex';
import { State } from '@/store';
export default Vue.extend({
  mounted() {
    // Get the game ID from the route and set it in the store
    const gameId = this.$route.params.gameid;
    this.$store.commit('createGameSuccess', { newGameId: gameId });

    // Bind data to firestore
    this.$store.dispatch('setupGameBinding');
    this.$store.dispatch('setupPlayerBinding');
  },
  computed: mapState({
    gameStarted(state: State) {
      return state.game.game.gameStarted;
    },
  }),
  watch: {
    gameStarted(newGameStarted) {
      if (newGameStarted === true) {
        this.$store.dispatch('routeToGame');
      }
    },
  },
  components: { 'player-list': PlayerList },
});
</script>
