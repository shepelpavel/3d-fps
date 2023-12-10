<template>
  <div id="container"></div>
</template>

<script>
import { Game } from "@/game";

export default {
  name: "App",
  mounted() {
    Game();
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/reset.scss";
@import "@/assets/styles/base.scss";
</style>
