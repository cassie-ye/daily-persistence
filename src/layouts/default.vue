<script setup lang="ts">
</script>

<template>
  <div class="bg-base min-h-screen text-base">
    <!-- 顶部导航栏 -->
    <header class="supports-backdrop-blur:bg-white/60 sticky top-0 z-40 w-full backdrop-blur dark:bg-black/60">
      <nav class="mx-auto h-16 max-w-7xl flex items-center justify-between px-4">
        <div class="flex items-center gap-4">
          <RouterLink to="/" class="flex items-center gap-2">
            <!-- <div i-carbon-calendar class="text-2xl" /> -->
            <span class="text-lg font-bold">Daily Persistence</span>
          </RouterLink>
        </div>

        <div class="flex items-center gap-4">
          <button class="icon-btn" @click="toggleDark()">
            <div i="carbon-sun dark:carbon-moon" />
          </button>
          <RouterLink to="/achievements" class="icon-btn">
            <div i-carbon-trophy />
          </RouterLink>
          <RouterLink to="/statistics" class="icon-btn">
            <div i-carbon-chart-line />
          </RouterLink>
          <RouterLink to="/settings" class="icon-btn">
            <div i-carbon-settings />
          </RouterLink>
        </div>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <main class="mx-auto max-w-7xl p-4 pb-20">
      <div class="router-view-container">
        <RouterView />
      </div>
    </main>

    <!-- 底部导航栏（移动端） -->
    <footer class="bg-base fixed bottom-0 left-0 right-0 border-t border-gray-200 md:hidden dark:border-gray-800">
      <nav class="h-14 flex justify-around">
        <RouterLink to="/" class="flex flex-1 flex-col items-center justify-center">
          <div i-carbon-home />
          <span class="text-xs">首页</span>
        </RouterLink>
        <RouterLink to="/achievements" class="flex flex-1 flex-col items-center justify-center">
          <div i-carbon-trophy />
          <span class="text-xs">成就</span>
        </RouterLink>
        <RouterLink to="/statistics" class="flex flex-1 flex-col items-center justify-center">
          <div i-carbon-chart-line />
          <span class="text-xs">统计</span>
        </RouterLink>
        <RouterLink to="/settings" class="flex flex-1 flex-col items-center justify-center">
          <div i-carbon-settings />
          <span class="text-xs">设置</span>
        </RouterLink>
      </nav>
    </footer>
  </div>
</template>

<style>
.icon-btn {
  --at-apply: inline-flex justify-center items-center w-8 h-8 rounded-full transition-colors hover-bg-gray-100
    drak-hover-bg-gray-800;
}

.bg-base {
  --at-apply: bg-white drak-bg-dark;
}

.text-base {
  --at-apply: text-gray-900 drak-text-gray-100;
}
</style>
