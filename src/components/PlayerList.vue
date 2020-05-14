<template>
  <section>
    <h2 class="title is-2">Players</h2>
    <div
      class="player-card card"
      v-for="player in players"
      :key="player.id"
      v-bind:class="{ 'has-background-light': isUserPlayer(player) }"
    >
      <div class="card-content">
        <span class="player-name is-size-3">{{ player.name }}</span>
        <span v-if="isUserPlayer(player)" class="tag is-medium is-info">You</span>
        <span v-if="isTurn(player)" class="tag is-medium is-success">Your Turn!</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
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
    isTurn(player: Player) {
      return player.id === this.$store.state.game.game.currentPlayer;
    },
    ...mapGetters(['isYourTurn']),
  },
});
</script>
