<!-- src/pages/statistics.vue -->
<script setup lang="ts">
import { Calendar, DataLine, PieChart } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { updateStatistics } from '~/composables/statistics'

const checkIns = useCheckIns()
const statistics = useStatistics()

// 定义渐变色
const gradientColors = {
  primary: '#c27aff',
  secondary: '#e7a5af',
  // 生成一系列渐变色供图表使用
  palette: [
    '#c27aff',
    '#d28ab7',
    '#e29a9f',
    '#e7a5af',
    '#c985e6',
    '#d095cc',
    '#dba5b2',
    '#e5b5a8',
  ],
}

// 图表引用
const heatmapRef = ref<HTMLElement>()
const lineChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

// 图表实例
let heatmapChart: echarts.ECharts | null = null
let lineChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null

// 初始化图表
onMounted(() => {
  // 确保统计数据是最新的
  updateStatistics()

  if (heatmapRef.value) {
    heatmapChart = echarts.init(heatmapRef.value)
    updateHeatmap()
  }

  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
    updateLineChart()
  }

  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    updatePieChart()
  }

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 更新热力图
function updateHeatmap() {
  if (!heatmapChart)
    return

  // 获取过去一年的数据
  const now = new Date()
  const data: [string, number][] = []
  for (let i = 0; i < 365; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    const count = checkIns.value.filter(c => c.date === dateStr).length
    data.unshift([dateStr, count])
  }

  heatmapChart.setOption({
    title: {
      text: '打卡热力图',
      subtext: '展示过去一年的打卡记录',
      left: 'center',
      textStyle: {
        color: '#333',
        fontWeight: 'normal',
      },
      subtextStyle: {
        color: '#999',
      },
    },
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        return `${params.data[0]}: ${params.data[1]} 次打卡`
      },
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      top: 50,
      text: ['高频', '低频'],
      inRange: {
        color: ['#f5f0ff', '#e7a5af', '#d28ab7', '#c27aff'],
      },
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ['auto', 20],
      range: data[0][0],
      itemStyle: {
        borderWidth: 0.5,
        borderColor: '#e0d6f0',
      },
      yearLabel: { show: false },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data,
    },
  })
}

// 更新折线图
function updateLineChart() {
  if (!lineChart)
    return

  // 获取过去30天的数据
  const now = new Date()
  const dates: string[] = []
  const counts: number[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    dates.push(dateStr)
    counts.push(checkIns.value.filter(c => c.date === dateStr).length)
  }

  lineChart.setOption({
    title: {
      text: '打卡趋势图',
      subtext: '展示过去30天的打卡频率变化',
      left: 'center',
      textStyle: {
        color: '#333',
        fontWeight: 'normal',
      },
      subtextStyle: {
        color: '#999',
      },
    },
    color: [gradientColors.primary],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${data.seriesName}: ${data.value} 次打卡`
      },
    },
    legend: {
      data: ['打卡次数'],
      top: 40,
      textStyle: {
        color: '#666',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        formatter: (value: string) => value.slice(5), // 只显示月-日
      },
      axisLine: {
        lineStyle: {
          color: '#e0d6f0',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '打卡次数',
      nameTextStyle: {
        color: '#666',
      },
      axisLine: {
        lineStyle: {
          color: '#e0d6f0',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#f5f0ff',
        },
      },
    },
    series: [
      {
        name: '打卡次数',
        data: counts,
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: gradientColors.primary },
              { offset: 1, color: gradientColors.secondary },
            ],
          },
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${gradientColors.primary}cc` }, // 添加透明度
              { offset: 1, color: `${gradientColors.secondary}33` }, // 更透明
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: gradientColors.primary,
          borderColor: '#fff',
          borderWidth: 2,
        },
      },
    ],
  })
}

// 更新饼图
function updatePieChart() {
  if (!pieChart)
    return

  // 统计心情分布
  const moodCounts: Record<string, number> = {}
  checkIns.value.forEach((checkIn) => {
    moodCounts[checkIn.mood] = (moodCounts[checkIn.mood] || 0) + 1
  })

  const moodMap: Record<string, string> = {
    happy: '开心 😊',
    normal: '一般 😐',
    sad: '难过 😢',
    angry: '生气 😠',
    excited: '兴奋 🤩',
  }

  const data = Object.entries(moodCounts).map(([mood, count], index) => ({
    name: moodMap[mood] || mood,
    value: count,
    itemStyle: {
      color: gradientColors.palette[index % gradientColors.palette.length],
    },
  }))

  pieChart.setOption({
    title: {
      text: '心情分布图',
      subtext: '展示打卡时的心情统计',
      left: 'center',
      textStyle: {
        color: '#333',
        fontWeight: 'normal',
      },
      subtextStyle: {
        color: '#999',
      },
    },
    color: gradientColors.palette,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}次 ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      textStyle: {
        color: '#666',
      },
    },
    series: [
      {
        name: '心情分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333',
          },
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  })
}

// 处理窗口大小变化
function handleResize() {
  heatmapChart?.resize()
  lineChart?.resize()
  pieChart?.resize()
}

// 监听打卡数据变化
watch(checkIns, () => {
  updateHeatmap()
  updateLineChart()
  updatePieChart()
}, { deep: true })

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  heatmapChart?.dispose()
  lineChart?.dispose()
  pieChart?.dispose()
})
</script>

<template>
  <div class="pb-16">
    <h1 class="mb-6 text-2xl font-bold">
      数据统计
    </h1>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb-8">
      <el-col :span="24" :md="8">
        <el-card shadow="hover" class="mb-4 md:mb-0">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            总打卡天数
          </div>
          <div class="mt-2 text-3xl font-bold" style="color: #c27aff">
            {{ statistics.totalCheckIns }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" :md="8">
        <el-card shadow="hover" class="mb-4 md:mb-0">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            当前连续打卡
          </div>
          <div class="mt-2 text-3xl font-bold" style="color: #d28ab7">
            {{ statistics.consecutiveDays }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" :md="8">
        <el-card shadow="hover">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            最长连续打卡
          </div>
          <div class="mt-2 text-3xl font-bold" style="color: #e7a5af">
            {{ statistics.longestStreak }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <div class="space-y-8">
      <!-- 热力图 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center">
            <el-icon class="mr-2">
              <Calendar />
            </el-icon>
            <div class="text-lg font-bold">
              打卡热力图
            </div>
            <el-tooltip content="展示过去一年的打卡记录，颜色越深表示打卡次数越多" placement="top">
              <el-icon class="ml-2 text-gray-400">
                <el-icon-question />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <div ref="heatmapRef" class="h-80 w-full" />
      </el-card>

      <!-- 打卡趋势 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center">
            <el-icon class="mr-2">
              <DataLine />
            </el-icon>
            <div class="text-lg font-bold">
              打卡趋势
            </div>
            <el-tooltip content="展示过去30天的打卡频率变化，帮助你了解自己的坚持情况" placement="top">
              <el-icon class="ml-2 text-gray-400">
                <el-icon-question />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <div ref="lineChartRef" class="h-80 w-full" />
      </el-card>

      <!-- 心情分布 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center">
            <el-icon class="mr-2">
              <PieChart />
            </el-icon>
            <div class="text-lg font-bold">
              心情分布
            </div>
            <el-tooltip content="统计你打卡时的心情分布，了解自己的情绪状态" placement="top">
              <el-icon class="ml-2 text-gray-400">
                <el-icon-question />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <div ref="pieChartRef" class="h-80 w-full" />
      </el-card>
    </div>
  </div>
</template>

<style>
</style>
