<template>
  <router-view v-slot="data">
    <analysis :config="data"></analysis>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import analysis from "./analysis.vue";
export default defineComponent({
  components: {
    analysis,
  },
});
</script>

<style>
</style>