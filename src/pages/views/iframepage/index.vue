<template>
  <iframe
    :src="path"
    width="100%"
    height="100%"
    frameborder="0"></iframe>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const path = route.query.realPath;
    return {
      path,
    };
  },
});
</script>

<style>
</style>
