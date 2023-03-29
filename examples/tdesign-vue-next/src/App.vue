<template>
  <t-layout>
    <t-aside>
      <t-menu :theme="mode">
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
      <t-header>
        <t-button shape="circle" @click="switchThemeMode">
          <template #icon>
            <t-icon name="poweroff" />
          </template>
        </t-button>
      </t-header>
      <t-content>
        <Home />
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script setup>
import { ref } from 'vue'
import Home from './pages/Home.vue'

const mode = ref('light')

function switchThemeMode() {
  if (mode.value === 'light') {
    // 设置暗色模式
    document.documentElement.setAttribute('theme-mode', 'dark')
    mode.value = 'dark'
  } else {
    // 重置为浅色模式
    document.documentElement.removeAttribute('theme-mode')
    mode.value = 'light'
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
