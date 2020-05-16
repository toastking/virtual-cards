<template>
  <div class="box has-background-white-ter">
    <h2 class="title is-2">Players</h2>
    <ol class="list">
      <li class="player-list-item list-item" v-for="player in players" :key="player.id">
        <b-tooltip class="columns is-vcentered player-info" :label="player.name" animated>
          <div class="column is-narrow">
            <avatar :avatar="player.avatar" />
          </div>
          <div class="column player-name has-text-left is-size-4">
            <p>{{ player.name }}</p>
          </div>
          <div class="column is-narrow">
            <span v-if="isTurn(player)" class="turn-tag tag is-success is-medium">Turn</span>
          </div>
        </b-tooltip>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Avatar from '@/components/Avatar.vue';
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
  components: { avatar: Avatar },
});
</script>

<style scoped>
.player-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-list-item {
  cursor: pointer;
}
</style>
