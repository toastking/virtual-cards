<template>
  <section>
    <div class="playing-card-container container box">
      <div class="level">
        <vue-playing-card class="level-item" v-if="!gameOver" cover></vue-playing-card>
        <div class="level-item" v-for="deck of decks" :key="deck.id">
          <vue-playing-card
            v-if="!!deck.currentCard"
            :signature="deck.currentCard"
            :key="deck.currentCard"
          ></vue-playing-card>
        </div>
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
        return state.deck.decks;
      },
    }),
    ...mapState(['gameOver']),
  },
});
</script>