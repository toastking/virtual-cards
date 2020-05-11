<template>
  <div class="home">
    <create-game />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CreateGame from '@/components/CreateGame.vue';

export default Vue.extend({
  components: { 'create-game': CreateGame },
});
</script>
