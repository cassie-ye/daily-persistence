<!-- src/pages/settings.vue -->
<script setup lang="ts">
import { Delete, Download, Setting } from '@element-plus/icons-vue'

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

  showSuccess('数据导出成功')
}

// 清除数据
function clearData() {
  showConfirmDialog('确定要清除所有数据吗？此操作不可恢复！').then(() => {
    localStorage.clear()
    window.location.reload()
    showSuccess('数据已清除')
  }).catch(() => {
    // 用户取消操作
  })
}
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold">
      设置
    </h1>

    <div class="space-y-6">
      <!-- 主题设置 -->
      <el-card class="w-full">
        <template #header>
          <div class="flex items-center">
            <el-icon class="mr-2">
              <Setting />
            </el-icon>
            <span class="text-lg font-bold">主题设置</span>
          </div>
        </template>
        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium">主题模式</label>
            <el-select
              v-model="settings.theme"
              class="w-full"
            >
              <el-option value="light" label="浅色模式" />
              <el-option value="dark" label="深色模式" />
              <el-option value="system" label="跟随系统" />
            </el-select>
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
      </el-card>

      <!-- 语言设置 -->
      <el-card class="w-full">
        <template #header>
          <div class="text-lg font-bold">
            语言设置
          </div>
        </template>
        <div>
          <el-select
            v-model="settings.language"
            class="w-full"
          >
            <el-option value="zh-CN" label="简体中文" />
            <el-option value="en-US" label="English" />
          </el-select>
        </div>
      </el-card>

      <!-- 通知设置 -->
      <el-card class="w-full">
        <template #header>
          <div class="text-lg font-bold">
            通知设置
          </div>
        </template>
        <div class="flex items-center justify-between">
          <span>启用通知提醒</span>
          <el-switch
            v-model="settings.notifications"
            style="--el-switch-on-color: linear-gradient(to right, #c27aff, #e7a5af)"
            inline-prompt
            active-text="开"
            inactive-text="关"
          />
        </div>
      </el-card>

      <!-- 数据管理 -->
      <el-card class="w-full">
        <template #header>
          <div class="text-lg font-bold">
            数据管理
          </div>
        </template>
        <div class="space-y-4">
          <div>
            <el-button
              class="w-full"
              type="primary"
              @click="exportData"
            >
              <el-icon class="mr-1">
                <Download />
              </el-icon>
              导出数据
            </el-button>
          </div>
          <div>
            <el-button
              class="w-full"
              type="danger"
              @click="clearData"
            >
              <el-icon class="mr-1">
                <Delete />
              </el-icon>
              清除所有数据
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 关于 -->
      <el-card class="w-full">
        <template #header>
          <div class="text-lg font-bold">
            关于
          </div>
        </template>
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
      </el-card>
    </div>
  </div>
</template>

<style>
</style>
