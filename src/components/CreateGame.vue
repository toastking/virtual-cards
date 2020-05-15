<template>
  <b-tabs>
    <b-tab-item label="Join a Game">
      <b-field label="Player Name">
        <b-input v-model="playerName"></b-input>
      </b-field>
      <b-field label="Game ID">
        <b-input id="game-field" v-model="gameId"></b-input>
      </b-field>
      <b-button
        id="join-game-button"
        type="is-primary"
        v-on:click="joinGame({ playerName, gameId })"
      >Join Game</b-button>
    </b-tab-item>

    <b-tab-item label="Create Game">
      <b-field label="Player Name">
        <b-input v-model="playerName"></b-input>
      </b-field>
      <b-button
        id="create-game-button"
        type="is-primary"
        v-on:click="createGame({ hostPlayerName: playerName })"
      >Create Game</b-button>
    </b-tab-item>
  </b-tabs>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  data: () => ({ playerName: '', gameId: '' }),
  created() {
    // If we have a gameid, fill that in
    const gameId = this.$route.params.gameid;
    if (gameId) {
      this.gameId = gameId;
    }
  },
  methods: { ...mapActions(['createGame', 'joinGame']) },
});
</script>
