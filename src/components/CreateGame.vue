<template>
  <b-tabs>
    <b-tab-item label="Join a Game">
      <b-field label="Game ID">
        <b-input></b-input>
      </b-field>
      <b-button type="is-primary">Join Game</b-button>
    </b-tab-item>

    <b-tab-item label="Create Game">
      <b-field label="Player Name">
        <b-input v-model="hostPlayerName"></b-input>
      </b-field>
      <b-button type="is-primary" v-on:click="createGame({ hostPlayerName })"
        >Create Game</b-button
      >
    </b-tab-item>
  </b-tabs>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import { createGame } from '../store/action-types';

export default Vue.extend({
  data: () => ({ hostPlayerName: '' }),
  methods: { ...mapActions([createGame]) },
});
</script>
