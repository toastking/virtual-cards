<template>
  <player-list />
</template>
<script lang="ts">
// Lobby to show players
import Vue from 'vue';
import PlayerList from '../components/PlayerList.vue';
export default Vue.extend({ components: { 'player-list': PlayerList } });
</script>