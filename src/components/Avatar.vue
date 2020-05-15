<template>
  <figure class="image is-48x48">
    <img v-if="avatar === Avatar.NONE" src="../assets/logo.png" />
    <img class="avatar" v-else-if="avatar === Avatar.ALPACA" src="../assets/alpaca.svg" />
    <img class="avatar" v-else-if="avatar === Avatar.BUFALLO" src="../assets/buffallo.svg" />
    <img class="avatar" v-else-if="avatar === Avatar.GIRAFFE" src="../assets/giraffe.svg" />
    <img class="avatar" v-else-if="avatar === Avatar.OTTER" src="../assets/otter.svg" />
    <img class="avatar" v-else-if="avatar === Avatar.SHEEP" src="../assets/sheep.svg" />
  </figure>
</template>

<script lang="ts">
import Vue from 'vue';
import { Avatar } from '@/store/modules/player';
export default Vue.extend({
  data: () => ({ Avatar }),
  props: ['avatar'],
});
</script>

<style scoped>
.avatar {
  width: 48px;
  height: 48px;
}
</style>
 