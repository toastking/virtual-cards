<template>
  <div class="playing-card-container columns box">
    <div
      id="deck"
      class="column remaining-deck"
      v-if="!gameOver"
      v-on:click="turnHandler()"
    >
      <vue-playing-card cover></vue-playing-card>
    </div>
    <div id="drawn-cards" class="column" v-for="deck of decks" :key="deck.id">
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
  // tslint:disable-next-line:no-empty
  methods: { ...mapActions(['doTurn']), turnHandler() {} },
});
</script>

<style lang="scss" scoped>
@import '~bulma';

.remaining-deck {
  cursor: pointer;
  border-radius: $radius;
}

.remaining-deck:hover {
  background: $primary;
}
</style>
