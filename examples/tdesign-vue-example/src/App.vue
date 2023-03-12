<template>
  <div id="app">
    <t-layout>
    <t-aside>
      <t-menu>
        <t-menu-item value="0">
          <template #icon>
            <t-icon name="app" />
          </template>
          仪表盘
        </t-menu-item>

        <t-submenu value="1" title="资源列表">
          <template #icon>
            <t-icon name="code" />
          </template>
          <t-menu-item value="1-1" disabled>
            <span>菜单二</span>
          </t-menu-item>
        </t-submenu>
        <t-submenu value="2" title="调度平台">
          <template #icon>
            <t-icon name="file" />
          </template>
          <t-submenu value="2-1" title="二级菜单-1">
            <t-menu-item value="3-1">三级菜单-1</t-menu-item>
            <t-menu-item value="3-2">三级菜单-2</t-menu-item>
            <t-menu-item value="3-3">三级菜单-3</t-menu-item>
          </t-submenu>
          <t-menu-item value="2-2">
            <span>二级菜单-2</span>
          </t-menu-item>
        </t-submenu>
      </t-menu>
    </t-aside>
    <t-layout>
      <t-content>
        <Home />
      </t-content>
    </t-layout>
  </t-layout>
  </div>
</template>

<script>
import Home from '@/pages/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
