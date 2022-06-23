<template>
  <tt-keep-alive ref="keepAliveRef">
    <Component
      v-if="
        !config.route.meta.pageType &&
          config.route.meta.keepAlive &&
          config.route.fullPath != excludePath
      "
      :is="config.Component"
      :key="config.route.fullPath"></Component>
  </tt-keep-alive>
  <Component
    v-if="
      !config.route.meta.pageType &&
        !config.route.meta.keepAlive &&
        config.route.fullPath != excludePath
    "
    :is="config.Component"
    :key="config.route.fullPath"></Component>

  <Component
    v-for="(value, key) in iframePages"
    :key="key"
    :is="value"
    :style="
      config.route.fullPath == key ? { display: 'block' } : { display: 'none' }
    "></Component>
</template>

<script lang="ts">
import {
  defineComponent, getCurrentInstance, nextTick, ref, watch,
} from 'vue';
import { KeepAliveImpl } from '@/components/MultiRouterView/swkeepalive';

export default defineComponent({
  props: {
    config: {
      default: {},
      type: Object,
    },
  },
  components: {
    'tt-keep-alive': KeepAliveImpl,
  },
  setup(props) {
    const { proxy }: any = getCurrentInstance();
    const $root = proxy.$root;
    const iframePages = ref({});
    const keepAliveRef = ref(null);
    if (
      props.config.route
      && props.config.route.meta.pageType == 'iframe'
      && !(iframePages.value as any)[props.config.route.fullPath]
    ) {
      (iframePages.value as any)[props.config.route.fullPath] = props.config.Component;
    }

    const excludePath = ref(null);
    function delCache(fullPath: any) {
      if ((iframePages.value as any)[fullPath]) {
        delete (iframePages.value as any)[fullPath];
      } else {
        // TODO 没有在keep-alive内缓存的路由会报错
        (keepAliveRef.value as any).pruneCacheEntry(fullPath);
      }
    }

    function reload(fullPath: any) {
      if ((iframePages.value as any)[fullPath]) {
        const key = fullPath;
        const value = (iframePages.value as any)[fullPath];
        delete (iframePages.value as any)[fullPath];
        nextTick(() => {
          (iframePages.value as any)[key] = value;
        });
      } else {
        excludePath.value = fullPath;
        if (
          props.config.route.meta.keepAlive
          && props.config.route.meta.pageType != 'iframe'
        ) {
          (keepAliveRef.value as any).pruneCacheEntry(fullPath);
        }
        nextTick(() => {
          excludePath.value = null;
        });
      }
    }

    $root.delCache = delCache;
    $root.reload = reload;

    watch(
      () => props.config,
      () => {
        if (
          props.config.route
          && props.config.route.meta.pageType == 'iframe'
          && !(iframePages.value as any)[props.config.route.fullPath]
        ) {
          (iframePages.value as any)[props.config.route.fullPath] = props.config.Component;
        }
      },
    );

    return {
      iframePages, keepAliveRef, excludePath, delCache, reload,
    };
  },
});
</script>

<style>
</style>
