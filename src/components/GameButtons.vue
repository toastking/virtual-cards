<template>
  <div>
    <b-button class="is-large is-primary" expanded v-on:click="doTurn()">Draw Card</b-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
export default Vue.extend({
  methods: { ...mapActions(['doTurn']) },
});
</script>