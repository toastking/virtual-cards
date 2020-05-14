<template>
  <div class="colums">
    <div class="column is-three-quartes">
      <play-area></play-area>
      <game-buttons></game-buttons>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PlayArea from '@/components/PlayArea.vue';
import GameButtons from '@/components/GameButtons.vue';

export default Vue.extend({
  mounted() {
    this.$store.dispatch('setupDeckBinding');
  },
  components: { 'play-area': PlayArea, 'game-buttons': GameButtons },
});
</script>
