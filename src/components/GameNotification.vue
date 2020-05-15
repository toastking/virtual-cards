<template>
  <div class="container">
    <section v-if="isYourTurn" class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Your Turn!</h1>
        </div>
      </div>
    </section>
    <section v-if="gameOver" class="hero is-success">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Game Over!</h1>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
export default Vue.extend({
  computed: { ...mapGetters(['isYourTurn', 'gameOver']) },
});
</script>