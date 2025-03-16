<!--
 * @Author: cassie-ye cassie20190909@gmail.com
 * @Date: 2025-03-16 20:54:34
 * @LastEditors: cassie-ye cassie20190909@gmail.com
 * @LastEditTime: 2025-03-16 22:04:10
 * @FilePath: \daily-persistence\src\pages\achievements.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- src/pages/achievements.vue -->
<script setup lang="ts">
const achievements = useAchievements()

// 成就类型
const achievementTypes = [
  { value: 'all', label: '全部' },
  { value: 'consecutive', label: '连续打卡' },
  { value: 'cumulative', label: '累计打卡' },
  { value: 'specific', label: '特定计划' },
  { value: 'special', label: '特殊事件' },
  { value: 'active', label: '活跃度' },
]

const currentType = ref('all')

// 已解锁的成就
const unlockedAchievements = computed(() => {
  return achievements.value.filter(a => a.unlockedAt)
})

// 根据类型筛选成就
const filteredAchievements = computed(() => {
  if (currentType.value === 'all')
    return achievements.value
  return achievements.value.filter(a => a.type === currentType.value)
})

// 检查成就是否已解锁
function isUnlocked(achievement: Achievement) {
  return !!achievement.unlockedAt
}

// 获取成就等级样式
function getLevelClass(level: string) {
  switch (level) {
    case 'easy':
      return 'achievement-level-easy'
    case 'medium':
      return 'achievement-level-medium'
    case 'hard':
      return 'achievement-level-hard'
    case 'expert':
      return 'achievement-level-expert'
    default:
      return 'achievement-level-default'
  }
}
</script>

<template>
  <div class="pb-16">
    <h1 class="mb-6 text-2xl font-bold">
      成就墙
    </h1>

    <!-- 成就统计 -->
    <div class="mb-8 card">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            已解锁成就
          </div>
          <div class="mt-2 text-3xl font-bold">
            {{ unlockedAchievements.length }}/{{ achievements.length }}
          </div>
        </div>
        <div class="text-4xl">
          🏆
        </div>
      </div>
    </div>

    <!-- 成就分类标签 -->
    <div class="mb-6 flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="type in achievementTypes"
        :key="type.value"
        class="whitespace-nowrap btn"
        :class="{ 'btn-primary': currentType === type.value }"
        @click="currentType = type.value"
      >
        {{ type.label }}
      </button>
    </div>

    <!-- 成就列表 -->
    <div class="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
      <div
        v-for="achievement in filteredAchievements"
        :key="achievement.id"
        class="card"
        :class="{
          'opacity-50': !isUnlocked(achievement),
          'achievement-unlocked': isUnlocked(achievement),
        }"
      >
        <div class="flex items-start gap-4">
          <div
            class="h-12 w-12 flex items-center justify-center rounded-lg text-2xl"
            :class="getLevelClass(achievement.level)"
          >
            <div :class="achievement.icon" />
          </div>
          <div class="flex-1">
            <h3 class="font-bold">
              {{ achievement.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ achievement.description }}
            </p>
            <div
              v-if="isUnlocked(achievement)"
              class="mt-2 text-sm text-green-600 dark:text-green-400"
            >
              已解锁于 {{ formatDate(new Date(achievement.unlockedAt!)) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>
