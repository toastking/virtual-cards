<template>
  <div v-if="isYourTurn">
    <b-button
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
  computed: { ...mapGetters(['isYourTurn', 'turnIsLoading']) },
  methods: { ...mapActions(['doTurn']), turnHandler() {} },
});
</script>
