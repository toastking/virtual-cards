<template>
  <section>
    <div class="playing-card-container container">
      <div v-for="deck of decks" :key="deck.id">
        <vue-playing-card v-if="!!deck.currentCard" signature="deck.currentCard"></vue-playing-card>
        <vue-playing-card v-else cover></vue-playing-card>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { State } from '@/store';
export default Vue.extend({
  computed: {
    ...mapState({
      decks(state: State) {
        return state.decks.decks;
      },
    }),
  },
});
</script>