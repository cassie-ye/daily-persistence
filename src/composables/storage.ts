import type { Achievement, CheckIn, Plan, Statistics, UserSettings } from '~/types'
import { ref, watch } from 'vue'

const STORAGE_KEYS = {
  PLANS: 'daily-persistence-plans',
  CHECK_INS: 'daily-persistence-checkins',
  ACHIEVEMENTS: 'daily-persistence-achievements',
  SETTINGS: 'daily-persistence-settings',
  STATISTICS: 'daily-persistence-statistics',
} as const

// 创建响应式存储
export function usePlans() {
  if (!localStorage) {
    return []
  }
  const plans = ref<Plan[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANS) || '[]'))

  watch(plans, (newPlans) => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(newPlans))
  }, { deep: true })

  return plans
}

export function useCheckIns() {
  if (!localStorage) {
    return []
  }
  const checkIns = ref<CheckIn[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECK_INS) || '[]'))

  watch(checkIns, (newCheckIns) => {
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(newCheckIns))
  }, { deep: true })

  return checkIns
}

export function useAchievements() {
  if (!localStorage) {
    return []
  }
  const achievements = ref<Achievement[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS) || '[]'))

  watch(achievements, (newAchievements) => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(newAchievements))
  }, { deep: true })

  return achievements
}

export function useSettings() {
  const defaultSettings: UserSettings = {
    theme: 'system',
    language: 'zh-CN',
    notifications: true,
    unlockedThemes: ['light', 'dark'],
  }

  const settings = ref<UserSettings>(
    JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(defaultSettings)),
  )

  watch(settings, (newSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings))
  }, { deep: true })

  return settings
}

export function useStatistics() {
  if (!localStorage) {
    return []
  }
  const defaultStats: Statistics = {
    totalCheckIns: 0,
    consecutiveDays: 0,
    longestStreak: 0,
    achievements: [],
    moodDistribution: {},
    weeklyActivity: Array.from({ length: 7 }).fill(0),
    monthlyActivity: Array.from({ length: 30 }).fill(0),
  }

  const statistics = ref<Statistics>(
    JSON.parse(localStorage.getItem(STORAGE_KEYS.STATISTICS) || JSON.stringify(defaultStats)),
  )

  watch(statistics, (newStats) => {
    localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(newStats))
  }, { deep: true })

  return statistics
}

// 工具函数
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
