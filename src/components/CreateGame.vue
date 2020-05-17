<template>
  <b-tabs>
    <b-tab-item label="Join a Game">
      <b-field label="Player Name">
        <b-input v-model="playerName"></b-input>
      </b-field>
      <b-field label="Avatar">
        <b-select v-model="avatar" placeholder="Select an avatar" expanded>
          <option v-for="(value,key) in avatars" :value="value" :key="key">{{ key }}</option>
        </b-select>
      </b-field>
      <b-field label="Game ID">
        <b-input id="game-field" v-model="gameId"></b-input>
      </b-field>
      <b-button
        id="join-game-button"
        type="is-primary"
        v-on:click="joinGame({ playerName,avatar, gameId })"
      >Join Game</b-button>
    </b-tab-item>

    <b-tab-item label="Create Game">
      <b-field label="Player Name">
        <b-input v-model="playerName"></b-input>
      </b-field>
      <b-field label="Avatar">
        <b-select v-model="avatar" placeholder="Select an avatar" expanded>
          <option v-for="(value,key) in avatars" :value="value" :key="key">{{ key }}</option>
        </b-select>
      </b-field>
      <b-button
        id="create-game-button"
        type="is-primary"
        v-on:click="createGame({ hostPlayerName: playerName,avatar })"
      >Create Game</b-button>
    </b-tab-item>
  </b-tabs>
</template>

<script lang="ts">
import { Avatar } from '@/store/modules/player';
import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  data: () => ({
    playerName: '',
    gameId: '',
    avatars: {
      None: Avatar.NONE,
      Alpaca: Avatar.ALPACA,
      Buffallo: Avatar.BUFALLO,
      Giraffe: Avatar.GIRAFFE,
      Otter: Avatar.OTTER,
      Sheep: Avatar.SHEEP,
    },
    avatar: Avatar.NONE,
  }),
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
