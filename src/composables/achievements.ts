import type { Achievement } from '~/types'
import { useAchievements, useCheckIns, usePlans } from './storage'

// 预定义成就列表
const ACHIEVEMENTS: Achievement[] = [
  // 连续打卡成就
  {
    id: 'consecutive-3',
    name: '初露锋芒',
    description: '连续打卡3天',
    type: 'consecutive',
    level: 'easy',
    icon: 'i-carbon-sprout',
    requirement: 3,
    isHidden: false,
  },
  {
    id: 'consecutive-7',
    name: '坚持一周',
    description: '连续打卡7天',
    type: 'consecutive',
    level: 'easy',
    icon: 'i-carbon-growth',
    requirement: 7,
    isHidden: false,
  },
  {
    id: 'consecutive-14',
    name: '两周达人',
    description: '连续打卡14天',
    type: 'consecutive',
    level: 'medium',
    icon: 'i-carbon-tree',
    requirement: 14,
    isHidden: false,
  },
  {
    id: 'consecutive-30',
    name: '月度冠军',
    description: '连续打卡30天',
    type: 'consecutive',
    level: 'hard',
    icon: 'i-carbon-forest',
    requirement: 30,
    isHidden: false,
  },
  {
    id: 'consecutive-100',
    name: '百日不倒',
    description: '连续打卡100天',
    type: 'consecutive',
    level: 'expert',
    icon: 'i-carbon-mountain',
    requirement: 100,
    isHidden: false,
  },

  // 累计打卡成就
  {
    id: 'cumulative-10',
    name: '初次体验',
    description: '累计打卡10次',
    type: 'cumulative',
    level: 'easy',
    icon: 'i-carbon-star',
    requirement: 10,
    isHidden: false,
  },
  {
    id: 'cumulative-50',
    name: '渐入佳境',
    description: '累计打卡50次',
    type: 'cumulative',
    level: 'medium',
    icon: 'i-carbon-star-half',
    requirement: 50,
    isHidden: false,
  },
  {
    id: 'cumulative-100',
    name: '百次里程',
    description: '累计打卡100次',
    type: 'cumulative',
    level: 'hard',
    icon: 'i-carbon-star-filled',
    requirement: 100,
    isHidden: false,
  },
  {
    id: 'cumulative-365',
    name: '年度达人',
    description: '累计打卡365次',
    type: 'cumulative',
    level: 'expert',
    icon: 'i-carbon-badge',
    requirement: 365,
    isHidden: false,
  },

  // 特定计划成就
  {
    id: 'specific-30days',
    name: '计划达成',
    description: '完成一个30天计划',
    type: 'specific',
    level: 'medium',
    icon: 'i-carbon-task-complete',
    requirement: 30,
    isHidden: false,
  },

  // 特殊事件成就
  {
    id: 'special-new-year',
    name: '新年快乐',
    description: '在新年第一天打卡',
    type: 'special',
    level: 'easy',
    icon: 'i-carbon-celebration',
    requirement: 1,
    isHidden: false,
  },
  {
    id: 'special-birthday',
    name: '生日祝福',
    description: '在生日当天打卡',
    type: 'special',
    level: 'easy',
    icon: 'i-carbon-cake',
    requirement: 1,
    isHidden: true,
  },

  // 活跃度成就
  {
    id: 'active-week',
    name: '活跃达人',
    description: '连续一周每天都进行打卡',
    type: 'active',
    level: 'medium',
    icon: 'i-carbon-activity',
    requirement: 7,
    isHidden: false,
  },
]

// 初始化成就系统
export function initializeAchievements() {
  const achievements = useAchievements()
  if (achievements.value.length === 0)
    achievements.value = ACHIEVEMENTS
}

// 检查并更新成就
export function checkAchievements() {
  const achievements = useAchievements()
  const checkIns = useCheckIns()
  const plans = usePlans()

  const now = new Date()
  const today = now.toISOString().split('T')[0]

  // 获取所有打卡日期
  const checkInDates = [...new Set(checkIns.value.map(c => c.date))].sort()

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

  // 检查连续打卡成就
  const consecutiveAchievements = achievements.value.filter(a => a.type === 'consecutive')
  for (const achievement of consecutiveAchievements) {
    if (!achievement.unlockedAt && consecutiveDays >= achievement.requirement) {
      achievement.unlockedAt = now.toISOString()
      showAchievementNotification(achievement)
    }
  }

  // 检查累计打卡成就
  const totalCheckIns = checkInDates.length
  const cumulativeAchievements = achievements.value.filter(a => a.type === 'cumulative')
  for (const achievement of cumulativeAchievements) {
    if (!achievement.unlockedAt && totalCheckIns >= achievement.requirement) {
      achievement.unlockedAt = now.toISOString()
      showAchievementNotification(achievement)
    }
  }

  // 检查特定计划成就
  const completedPlans = plans.value.filter((plan) => {
    if (!plan.endDate)
      return false
    const planCheckIns = checkIns.value.filter(c => c.planId === plan.id)
    const planDays = Math.ceil(
      (new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime())
      / (1000 * 60 * 60 * 24),
    )
    return planCheckIns.length >= planDays
  })

  const specificAchievements = achievements.value.filter(a => a.type === 'specific')
  for (const achievement of specificAchievements) {
    if (!achievement.unlockedAt && completedPlans.length > 0) {
      achievement.unlockedAt = now.toISOString()
      showAchievementNotification(achievement)
    }
  }

  // 检查特殊事件成就
  const specialAchievements = achievements.value.filter(a => a.type === 'special')
  for (const achievement of specialAchievements) {
    if (achievement.unlockedAt)
      continue

    if (achievement.id === 'special-new-year') {
      const isNewYear = today.endsWith('-01-01')
      if (isNewYear && checkInDates.includes(today)) {
        achievement.unlockedAt = now.toISOString()
        showAchievementNotification(achievement)
      }
    }
    // 其他特殊事件成就可以在这里添加
  }

  // 检查活跃度成就
  const activeAchievements = achievements.value.filter(a => a.type === 'active')
  for (const achievement of activeAchievements) {
    if (achievement.unlockedAt)
      continue

    if (achievement.id === 'active-week') {
      // 检查最近7天是否每天都有打卡
      let isActive = true
      for (let i = 0; i < 7; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        if (!checkInDates.includes(dateStr)) {
          isActive = false
          break
        }
      }

      if (isActive) {
        achievement.unlockedAt = now.toISOString()
        showAchievementNotification(achievement)
      }
    }
  }
}

// 显示成就通知
function showAchievementNotification(achievement: Achievement) {
  if (!('Notification' in window))
    return

  if (Notification.permission === 'granted') {
    new Notification('解锁新成就！', {
      body: `恭喜你获得成就：${achievement.name}\n${achievement.description}`,
      icon: '/favicon.ico',
    })
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('解锁新成就！', {
          body: `恭喜你获得成就：${achievement.name}\n${achievement.description}`,
          icon: '/favicon.ico',
        })
      }
    })
  }
}
