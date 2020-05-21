<template>
  <div id="player-list" class="box has-background-white-ter">
    <h2 class="title is-2">Players</h2>
    <ol class="list">
      <li
        class="player-list-item list-item"
        v-for="player in players"
        :key="player.id"
        @click="
          clickedPlayer = player;
          showPlayerDialog = true;
        "
      >
        <b-tooltip
          class="columns is-vcentered player-info"
          :label="player.name"
          animated
        >
          <div class="column is-narrow">
            <avatar :avatar="player.avatar" />
          </div>
          <div class="column player-name has-text-left is-size-4">
            <p>{{ player.name }}</p>
          </div>
          <div class="column is-narrow">
            <span
              v-if="isTurn(player)"
              class="turn-tag tag is-success is-medium"
              >Turn</span
            >
          </div>
        </b-tooltip>
      </li>
    </ol>
    <b-modal
      :active.sync="showPlayerDialog"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    >
      <playerDialog :player="clickedPlayer"></playerDialog>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Avatar from '@/components/Avatar.vue';
import PlayerDialog from '@/components/PlayerDialog.vue';
import { State } from '@/store';
import { Player, PlayerState } from '@/store/modules/player';
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import { GameModule } from '../store/modules/game';

export default Vue.extend({
  data: () => ({
    clickedPlayer: null,
    showPlayerDialog: false,
  }),
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
  components: { avatar: Avatar, PlayerDialog },
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
