/*
 * @Author: cassie-ye cassie20190909@gmail.com
 * @Date: 2025-03-16 20:19:02
 * @LastEditors: cassie-ye cassie20190909@gmail.com
 * @LastEditTime: 2025-03-16 21:29:13
 * @FilePath: \daily-persistence\src\types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

// 打卡计划类型
export interface Plan {
  id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  goal?: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

// 打卡记录类型
export interface CheckIn {
  id: string
  planId: string
  date: string
  time: string
  mood: string
  weather?: string
  location?: string
  notes?: string
  images?: string[]
  createdAt: string
}

// 成就类型
export interface Achievement {
  id: string
  name: string
  description: string
  type: 'consecutive' | 'cumulative' | 'specific' | 'special' | 'active'
  level: 'easy' | 'medium' | 'hard' | 'expert'
  icon: string
  requirement: number
  isHidden: boolean
  unlockedAt?: string
}

// 用户统计数据类型
export interface Statistics {
  totalCheckIns: number
  consecutiveDays: number
  longestStreak: number
  achievements: string[]
  moodDistribution: Record<string, number>
  weeklyActivity: number[]
  monthlyActivity: number[]
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 语言类型
export type Language = 'zh-CN' | 'en-US'

// 用户设置类型
export interface UserSettings {
  theme: Theme
  language: Language
  notifications: boolean
  unlockedThemes: string[]
}
