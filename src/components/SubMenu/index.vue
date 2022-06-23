<template>
  <a-sub-menu v-if="!menuInfo.url" :key="menuInfo.id">
    <template #icon>
      <MenuFoldOutlined style="font-size: 16px; color: #ffffff"/>
    </template>
    <template #title>
      <span v-if="menuInfo.name.indexOf(filterOption) > -1">
        {{ menuInfo.name.substr(0, menuInfo.name.indexOf(filterOption)) }}
        <span style="color: #f2fc21">{{ filterOption }}</span>
        {{
          menuInfo.name.substr(
            menuInfo.name.indexOf(filterOption) + filterOption.length
          )
        }}
      </span>
      <template v-else> {{ menuInfo.name }}</template>
    </template>
    <sub-menu
      :menu-info="item"
      :filterOption="filterOption"
      v-for="item in menuInfo.children"
      :key="item.id"/>
  </a-sub-menu>
  <a-menu-item :key="menuInfo.id" v-else>
    <template #icon>
      <MenuFoldOutlined style="font-size: 16px; color: #ffffff" />
    </template>
    <router-link :to="menuInfo.pageType=='iframe'?{path:'/iframe-page',query:{realPath:menuInfo.url,defineTitle:menuInfo.name}}:menuInfo.url">
      <template v-if="menuInfo.name.indexOf(filterOption) > -1">
        {{ menuInfo.name.substr(0, menuInfo.name.indexOf(filterOption)) }}
        <span style="color: #f2fc21">{{ filterOption }}</span>
        {{
          menuInfo.name.substr(
            menuInfo.name.indexOf(filterOption) + filterOption.length
          )
        }}
      </template>
      <template v-else> {{ menuInfo.name }}</template>
    </router-link>
  </a-menu-item>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { MenuFoldOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'SubMenu',
  components: {
    MenuFoldOutlined,
  },
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
    filterOption: {
      type: String,
      default: '',
    },
  },
});
</script>
