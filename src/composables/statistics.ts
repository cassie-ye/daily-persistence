import type { CheckIn } from '~/types'
import { useCheckIns, useStatistics } from './storage'

// 更新统计数据
export function updateStatistics() {
  const checkIns = useCheckIns()
  const statistics = useStatistics()

  const now = new Date()
  const today = now.toISOString().split('T')[0]

  // 获取所有打卡日期
  const checkInDates = [...new Set(checkIns.value.map((c: CheckIn) => c.date))].sort()

  // 更新总打卡天数
  statistics.value.totalCheckIns = checkInDates.length

  // 计算连续打卡天数
  let consecutiveDays = 0
  const currentDate = new Date(today)

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0]
    if (!checkInDates.includes(dateStr))
      break
    consecutiveDays++
    currentDate.setDate(currentDate.getDate() - 1)
  }

  statistics.value.consecutiveDays = consecutiveDays

  // 更新最长连续打卡天数
  if (consecutiveDays > statistics.value.longestStreak)
    statistics.value.longestStreak = consecutiveDays

  // 更新心情分布
  const moodCounts: Record<string, number> = {}
  checkIns.value.forEach((checkIn: CheckIn) => {
    moodCounts[checkIn.mood] = (moodCounts[checkIn.mood] || 0) + 1
  })
  statistics.value.moodDistribution = moodCounts

  // 更新周活跃度
  const weeklyActivity = Array.from<number>({ length: 7 }).fill(0)
  for (let i = 0; i < 7; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    weeklyActivity[i] = checkIns.value.filter((c: CheckIn) => c.date === dateStr).length
  }
  statistics.value.weeklyActivity = weeklyActivity

  // 更新月活跃度
  const monthlyActivity = Array.from<number>({ length: 30 }).fill(0)
  for (let i = 0; i < 30; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    monthlyActivity[i] = checkIns.value.filter((c: CheckIn) => c.date === dateStr).length
  }
  statistics.value.monthlyActivity = monthlyActivity
}

// 获取心情分布数据
export function getMoodDistribution() {
  const statistics = useStatistics()
  const moodMap: Record<string, string> = {
    happy: '开心 😊',
    normal: '一般 😐',
    sad: '难过 😢',
    angry: '生气 😠',
    excited: '兴奋 🤩',
  }

  return Object.entries(statistics.value.moodDistribution).map(([mood, count]) => ({
    name: moodMap[mood] || mood,
    value: count,
  }))
}

// 获取活跃度数据
export function getActivityData(type: 'weekly' | 'monthly') {
  const statistics = useStatistics()
  return type === 'weekly'
    ? statistics.value.weeklyActivity
    : statistics.value.monthlyActivity
}

// 获取打卡趋势数据
export function getCheckInTrend() {
  const checkIns = useCheckIns()
  const now = new Date()
  const dates: string[] = []
  const counts: number[] = []

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    dates.push(dateStr)
    counts.push(checkIns.value.filter((c: CheckIn) => c.date === dateStr).length)
  }

  return {
    dates,
    counts,
  }
}

// 获取热力图数据
export function getHeatmapData() {
  const checkIns = useCheckIns()
  const now = new Date()
  const data: [string, number][] = []

  for (let i = 0; i < 365; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const count = checkIns.value.filter((c: CheckIn) => c.date === dateStr).length
    data.unshift([dateStr, count])
  }

  return data
}
