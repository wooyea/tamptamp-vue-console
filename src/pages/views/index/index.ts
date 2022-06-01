import {
  defineComponent, reactive, toRefs,
} from 'vue';

export default defineComponent({
  setup() {
    const state = reactive({
      time: null,
    });

    return { ...toRefs(state) };
  },
});
