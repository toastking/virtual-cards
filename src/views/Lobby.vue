<template>
  <player-list />
</template>
<script lang="ts">
// Lobby to show players
import Vue from 'vue';
import PlayerList from '../components/PlayerList.vue';
export default Vue.extend({
  mounted() {
    // Bind data to firestore
    this.$store.dispatch('setupGameBinding');
    this.$store.dispatch('setupPlayerBinding');
  },
  components: { 'player-list': PlayerList },
});
</script>