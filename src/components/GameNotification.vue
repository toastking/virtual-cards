<template>
  <transition
    class="container"
    tag="div"
    enter-active-class="animate__animated animate__jackInTheBox"
    exit-active-class="animate__animated animate__slideOutLeft"
  >
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
          <b-button
            id="new-game-button"
            type="is-success"
            icon-left="redo"
            v-on:click="restartGame()"
            inverted
            >New Game</b-button
          >
        </div>
      </div>
    </section>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
export default Vue.extend({
  computed: { ...mapGetters(['isYourTurn', 'gameOver']) },
  methods: { ...mapActions(['restartGame']) },
});
</script>
