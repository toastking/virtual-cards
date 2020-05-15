<template>
  <b-navbar :shadow="true" type="is-light">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="../assets/logo.png" alt="logo" />
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({});
</script>