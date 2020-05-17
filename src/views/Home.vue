<template>
  <div class="home">
    <create-game />
  </div>
</template>

<script lang="ts">
import CreateGame from '@/components/CreateGame.vue';
import Vue from 'vue';

export default Vue.extend({
  components: { 'create-game': CreateGame },
});
</script>
