<template>
  <section class="section">
    <h2 class="title is-2">Players</h2>
    <div class="card" v-for="player in players" :key="player.id">
      <div class="card-content">
        <p class="title is-4">{{ player.name }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { State } from '@/store';
import { GameModule } from '../store/modules/game';
export default Vue.extend({
  computed: mapState({
    players: state => {
      console.log(state);
      return (state as State).player.players;
    },
  }),
});
</script>
