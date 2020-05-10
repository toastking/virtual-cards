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
      <b-button type="is-primary" v-on:click="callCreateGame()">Create Game</b-button>
    </b-tab-item>
  </b-tabs>
</template>

<script lang="ts">
import { createComponent, defineComponent } from "@vue/composition-api";
import { createGame } from "@/store/action-types";
import { Store } from "vuex";

export default defineComponent({
  setup: (props: {}, { root }) => {
    const { callCreateGame } = useCreateGameFirebaseConnection(root.$store);
    return { callCreateGame };
  }
});

function useCreateGameFirebaseConnection(store: Store<{}>) {
  const callCreateGame = () => {
    store.dispatch(createGame);
  };

  return { callCreateGame };
}
</script>
