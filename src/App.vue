<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { elementPlusLocale } from '~/modules/i18n'
import { checkAchievements, initializeAchievements } from './composables/achievements'
import { updateStatistics } from './composables/statistics'
import { useCheckIns } from './composables/storage'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    {
      name: 'description',
      content: 'Opinionated Vite Starter Template',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})

// 初始化成就系统
onMounted(() => {
  initializeAchievements()
})

// 监听打卡数据变化
const checkIns = useCheckIns()
watch(checkIns, () => {
  updateStatistics()
  checkAchievements()
}, { deep: true })
</script>

<template>
  <el-config-provider :locale="elementPlusLocale">
    <RouterView />
  </el-config-provider>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #121212;
  color-scheme: dark;
}

#nprogress {
  pointer-events: none;
}

#nprogress .bar {
  background: rgb(13, 148, 136);
  opacity: 0.75;
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
}
</style>
