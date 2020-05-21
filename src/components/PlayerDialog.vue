<template>
  <div class="container">
    <div v-if="isUserPlayer" id="change-player-name-form">
      <h3>Change Player Name</h3>
      <b-field label="New Name">
        <b-input
          id="new-player-name-input"
          v-model="name"
          placeholder="Name"
        ></b-input>
        <b-button
          id="change-player-name-button"
          type="is-primary"
          v-on:click="changePlayerName(name)"
          >Change Name</b-button
        >
      </b-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Player } from '@/store/modules/player';
import Vue, { PropType } from 'vue';
import { mapActions, mapState } from 'vuex';
import { State } from '../store';

export default Vue.extend({
  data: () => ({ name: '' }),
  props: {
    player: { type: (Object as unknown) as PropType<Player>, required: true },
  },
  computed: {
    ...mapState({
      userPlayerId(state: State) {
        return state.player.userPlayerId;
      },
    }),
    isUserPlayer() {
      return this.player?.id === this.userPlayerId;
    },
  },
  methods: {
    ...mapActions(['changePlayerName']),
  },
});
</script>
