<template>
  <div v-if="isYourTurn && !gameOver" class="button-container">
    <b-button
      id="draw-card-button"
      class="is-large is-primary"
      expanded
      :loading="turnIsLoading"
      v-on:click="turnHandler()"
    >Draw Card</b-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { throttle } from 'lodash';

export default Vue.extend({
  created() {
    this.turnHandler = throttle(() => {
      this.doTurn();
    }, 3000);
  },
  computed: { ...mapGetters(['isYourTurn', 'turnIsLoading', 'gameOver']) },
  methods: { ...mapActions(['doTurn']), turnHandler() {} },
});
</script>

<style scoped>
.button-container {
  padding: 1em;
}
</style>