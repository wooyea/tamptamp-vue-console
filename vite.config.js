import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import config from './build/config';
import { createEntry, hqPack } from './build/vite/createEntry';

const entry = createEntry(config);

// 详细配置规则见 https://cn.vitejs.dev/
export default defineConfig({
  base: config.base,
  plugins: [
    hqPack({
      base: config.base,
      virtualEntrys: entry.virtualEntrys,
    }),
    vue(),
    vueJsx(),
  ],
  optimizeDeps: {
    entries: 'src/pages/app.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      vue: 'vue/dist/vue.esm-bundler.js', // 定义vue的别名，如果使用其他的插件，可能会用到别名
    },
  },
  server: {
    port: config.devServerPort,
    proxy: config.devServerProxy,
  },
  build: {
    rollupOptions: {
      input: entry.input,
    },
  },

});
