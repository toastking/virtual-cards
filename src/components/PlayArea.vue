<template>
  <section>
    <div class="playing-card-container container box">
      <div class="level">
        <div class="level-item remaining-deck" v-if="!gameOver" v-on:click="drawCard()">
          <vue-playing-card cover></vue-playing-card>
        </div>
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
import { State } from '@/store';
import Vue from 'vue';
import { mapActions, mapGetters, mapState } from 'vuex';
export default Vue.extend({
  computed: {
    ...mapGetters(['gameOver', 'decks']),
  },
  methods: { ...mapActions(['drawCard']) },
});
</script>

<style scoped>
.remaining-deck {
  cursor: pointer;
}
</style>