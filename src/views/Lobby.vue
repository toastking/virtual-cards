<template>
  <section class="section">
    <h1 class="title is-1">Lobby</h1>
    <div class="container has-background-info has-text-white columns is-vcentered">
      <div class="share-text column is-three-quarters">Share! {{ shareUrl }}</div>
      <div class="column">
        <b-button
          type="is-info"
          icon-left="copy"
          v-clipboard:copy="shareUrl"
          v-on:click="showCopySnackbar()"
          outlined
          inverted
        >Copy</b-button>
      </div>
    </div>
    <div class="container">
      <player-list />
      <b-button
        id="start-game-button"
        type="is-success is-large"
        expanded
        v-on:click="startGame()"
      >Start Game</b-button>
    </div>
  </section>
</template>
<script lang="ts">
// Lobby to show players
import Vue from 'vue';
import PlayerList from '../components/PlayerList.vue';
import { mapState, mapActions } from 'vuex';
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
  computed: {
    ...mapState({
      gameStarted(state: State) {
        return state.game.game.gameStarted;
      },
    }),
    shareUrl() {
      return `${window.location.protocol}//${window.location.hostname}/#/start/${this.$route.params.gameid}`;
    },
  },
  methods: {
    ...mapActions(['startGame']),
    showCopySnackbar() {
      this.$buefy.snackbar.open({
        message: 'Lobby link copied!',
        type: 'is-info',
        position: 'is-top',
      });
    },
  },
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
<style scoped>
#start-game-button {
  margin-top: 1em;
}

.share-text {
  margin-right: 2em;
}
</style>
