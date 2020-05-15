<template>
  <section>
    <h2 class="title is-2">Players</h2>
    <ol class="list">
      <li class="list-item player-card" v-for="player in players" :key="player.id">
        <span class="player-info">
          <span class="player-name is-size-3">{{ player.name }}</span>
          <span v-if="isTurn(player)" class="tag is-success">Your Turn!</span>
        </span>
      </li>
    </ol>
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
    isTurn(player: Player) {
      return player.id === this.$store.state.game.game.currentPlayer;
    },
    ...mapGetters(['isYourTurn']),
  },
});
</script>

<style scoped>
.player-info {
  display: flex;
  align-items: center;
}
</style>
