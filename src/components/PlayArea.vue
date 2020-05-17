<template>
  <section>
    <div class="playing-card-container container box">
      <div class="level">
        <div
          class="level-item remaining-deck"
          v-if="!gameOver"
          v-on:click="turnHandler()"
        >
          <vue-playing-card cover></vue-playing-card>
        </div>
        <div class="level-item" v-for="deck of decks" :key="deck.id">
          <transition
            tag="div"
            name="playingcard"
            enter-active-class="animate__animated animate__flipInY"
          >
            <vue-playing-card
              v-if="!!deck.currentCard"
              :signature="deck.currentCard"
              :key="deck.currentCard"
            ></vue-playing-card>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { State } from '@/store';
import { throttle } from 'lodash';
import Vue from 'vue';
import { mapActions, mapGetters, mapState } from 'vuex';
export default Vue.extend({
  created() {
    this.turnHandler = throttle(() => {
      if ((this.isYourTurn as boolean) && !(this.turnIsLoading as boolean)) {
        this.doTurn();
      }
    }, 1000);
  },
  computed: {
    ...mapGetters(['gameOver', 'decks', 'isYourTurn', 'turnIsLoading']),
  },
  methods: { ...mapActions(['doTurn']), turnHandler() {} },
});
</script>

<style scoped>
.remaining-deck {
  cursor: pointer;
}
</style>
