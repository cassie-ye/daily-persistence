<!-- src/pages/settings.vue -->
<script setup lang="ts">
const settings = useSettings()

// 获取主题名称
function getThemeName(theme: string) {
  switch (theme) {
    case 'light':
      return '浅色'
    case 'dark':
      return '深色'
    default:
      return theme
  }
}

// 获取主题样式
function getThemeClass(theme: string) {
  switch (theme) {
    case 'light':
      return 'bg-gray-100 dark:bg-gray-700'
    case 'dark':
      return 'bg-gray-800 text-white'
    default:
      return 'bg-gray-100 dark:bg-gray-700'
  }
}

// 导出数据
function exportData() {
  const data = {
    settings: localStorage.getItem('daily-persistence-settings'),
    plans: localStorage.getItem('daily-persistence-plans'),
    checkIns: localStorage.getItem('daily-persistence-checkins'),
    achievements: localStorage.getItem('daily-persistence-achievements'),
    statistics: localStorage.getItem('daily-persistence-statistics'),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `daily-persistence-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 清除数据
function clearData() {
  if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
    localStorage.clear()
    window.location.reload()
  }
}
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold">
      设置
    </h1>

    <div class="space-y-6">
      <!-- 主题设置 -->
      <div class="card">
        <h2 class="mb-4 text-lg font-bold">
          主题设置
        </h2>
        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium">主题模式</label>
            <select
              v-model="settings.theme"
              class="w-full input"
            >
              <option value="light">
                浅色模式
              </option>
              <option value="dark">
                深色模式
              </option>
              <option value="system">
                跟随系统
              </option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium">已解锁的主题</label>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="theme in settings.unlockedThemes"
                :key="theme"
                class="rounded-lg p-2 text-center text-sm"
                :class="getThemeClass(theme)"
              >
                {{ getThemeName(theme) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 语言设置 -->
      <div class="card">
        <h2 class="mb-4 text-lg font-bold">
          语言设置
        </h2>
        <div>
          <select
            v-model="settings.language"
            class="w-full input"
          >
            <option value="zh-CN">
              简体中文
            </option>
            <option value="en-US">
              English
            </option>
          </select>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="card">
        <h2 class="mb-4 text-lg font-bold">
          通知设置
        </h2>
        <div class="flex items-center justify-between">
          <span>启用通知提醒</span>
          <label class="switch">
            <input
              v-model="settings.notifications"
              type="checkbox"
            >
            <span class="slider" />
          </label>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="card">
        <h2 class="mb-4 text-lg font-bold">
          数据管理
        </h2>
        <div class="space-y-4">
          <div>
            <button
              class="w-full btn"
              @click="exportData"
            >
              导出数据
            </button>
          </div>
          <div>
            <button
              class="w-full text-red-500 btn"
              @click="clearData"
            >
              清除所有数据
            </button>
          </div>
        </div>
      </div>

      <!-- 关于 -->
      <div class="card">
        <h2 class="mb-4 text-lg font-bold">
          关于
        </h2>
        <div class="text-sm text-gray-600 space-y-2 dark:text-gray-400">
          <p>每日坚持 v1.0.0</p>
          <p>一个帮助你培养良好习惯的打卡应用</p>
          <p>
            <a
              href="https://github.com/yourusername/daily-persistence"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:underline"
            >
              在 GitHub 上查看源码
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>
