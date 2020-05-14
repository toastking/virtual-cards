<template>
  <div v-if="isYourTurn">
    <b-button class="is-large is-primary" expanded v-on:click="doTurn()">Draw Card</b-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
export default Vue.extend({
  computed: { ...mapGetters(['isYourTurn']) },
  methods: { ...mapActions(['doTurn']) },
});
</script>