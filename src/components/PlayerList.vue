<template>
  <section class="section">
    <h2 class="title is-2">Players</h2>
    <div
      class="player-card card"
      v-for="player in players"
      :key="player.id"
      v-bind:class="{ 'has-background-light': isUserPlayer(player) }"
    >
      <div class="card-content">
        <p class="player-name title is-4">{{ player.name }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { State } from '@/store';
import { GameModule } from '../store/modules/game';
import { PlayerState, Player } from '@/store/modules/player';
export default Vue.extend({
  computed: mapState({
    players(state: State) {
      return state.player.players;
    },
  }),
  methods: {
    isUserPlayer(player: Player) {
      return player.id === this.$store.state.player.userPlayerId;
    },
  },
});
</script>
