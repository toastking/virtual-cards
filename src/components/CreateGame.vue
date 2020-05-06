<template>
  <b-tabs>
    <b-tab-item label="Join a Game">
      <b-field label="Game ID">
        <b-input></b-input>
      </b-field>
      <b-button type="is-primary">Join Game</b-button>
    </b-tab-item>

    <b-tab-item label="Create Game">
      <b-field label="Player Name">
        <b-input></b-input>
      </b-field>
      <b-button type="is-primary">Create Game</b-button>
    </b-tab-item>
  </b-tabs>
</template>

<script lang="ts">
import { createComponent, defineComponent } from '@vue/composition-api';

export default defineComponent({
  setup: () => {
    return {};
  },
});
</script>
