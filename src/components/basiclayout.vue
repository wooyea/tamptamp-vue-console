<template>
  <div class="sw-layout">
    <div style="height: 100%;background: #001529;transition: all 0.2s;"  :style="siderStyle">
      <div style="padding:10px 16px 5px;display:flex;justify-content: space-between;align-items: center;">
        <div style="display:inline-block;overflow:hidden" :style="sideSearchStyle">
          <a-input-search
            type="text"
            class="side-search-input"
            v-model:value="searchValue"
            @search="findMenu"
            @change="findMenu"
            placeholder="菜单搜索"/>
        </div>
        <MenuUnfoldOutlined
          style="color: #fff;font-size:16px;right:0"
          v-if="collapsed"
          @click="toggleCollapsed"/>
        <MenuFoldOutlined
          style="color: #fff;font-size:16px;right:0"
          v-else
          @click="toggleCollapsed"/>
      </div>
      <div class="sw-layout-sider">
        <a-menu
          mode="inline"
          theme="dark"
          :openKeys="openKeys"
          @openChange="openChange"
          :inline-collapsed="collapsed"
          class="sw-side-menu">
          <sub-menu
            v-for="(item, index) in menuList"
            :filterOption="searchValue"
            :menu-info="item"
            :key="index"/>
        </a-menu>
      </div>
    </div>

    <div  class="sw-layout-content">
      <multi-tab
        class="sw-multi-tab"
        ref="multiTab"/>
      <div id="sw-router-content">
        <multi-router-view />
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./basiclayout.ts"></script>
<style scoped>
.sw-layout {
  box-sizing: border-box;
  height: 100vh;
  background: #f0f2f5;
  display: flex;
  flex: auto;
  min-height: 0;
}

.sw-layout-content {
  overflow-x: hidden;
  flex: auto;
  min-height: 0;
  height: 100%;
  padding-top: 42px;
}
.sw-multi-tab {
  position: fixed;
  width: 100%;
  margin: 0 !important;
  top: 0;
  z-index: 10;
}

#sw-router-content {
  height: 100%;
  overflow-y: overlay;
  padding: 16px;
}

/* side menu */
.sw-layout-sider {
  width: 100%;
  height: calc(100% - 50px);
  overflow-y: auto;
  transition: all 0.2s;
}
.sw-layout-sider::-webkit-scrollbar {
  width: 0px !important;
}
.sw-layout-sider:deep(.ant-menu-inline-collapsed) {
  width: 48px;
}
.sw-layout-sider:deep(.ant-menu-inline-collapsed .ant-menu-item) {
  width: 48px;
  padding: 0 16px !important;
}
.sw-layout-sider:deep(.ant-menu-inline-collapsed .ant-menu-submenu-title) {
  width: 48px;
  padding: 0 16px !important;
}
.sw-side-menu {
  box-sizing: border-box;
}
.sw-side-menu :deep(.ant-menu-title-content) {
  color: #fff !important;
}
.sw-side-menu :deep(.ant-menu-item a) {
  color: #fff !important;
}

.side-search-input {
  width: 165px;
  transition: all 0.3s;
}
</style>
