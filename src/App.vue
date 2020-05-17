<template>
  <main id="app">
    <navbar />
    <router-view />
  </main>
</template>

<script lang="ts">
import NavBar from '@/components/NavBar.vue';
import Vue from 'vue';

export default Vue.extend({
  mounted() {
    const playerId = sessionStorage.getItem('playerId');
    if (playerId) {
      this.$store.commit('updateUserPlayerId', { playerId });
    }
  },
  components: { navbar: NavBar },
});
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
