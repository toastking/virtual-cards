<template>
  <div class="home">
    <create-game />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import CreateGame from '../components/CreateGame.vue';

export default defineComponent({
  setup() {
    return {};
  },
  components: { 'create-game': CreateGame },
});
</script>
