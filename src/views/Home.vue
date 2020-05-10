<template>
  <div class="home">
    <create-game />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import CreateGame from "../components/CreateGame.vue";
import { Store } from "vuex";
import { createGame } from "@/store/action-types";

export default defineComponent({
  setup() {},
  components: { "create-game": CreateGame }
});
</script>
