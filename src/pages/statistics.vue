<!-- src/pages/statistics.vue -->
<script setup lang="ts">
import * as echarts from 'echarts'

const checkIns = useCheckIns()
const statistics = useStatistics()

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
      top: 0,
    },
    calendar: {
      top: 60,
      left: 30,
      right: 30,
      cellSize: ['auto', 20],
      range: data[0][0],
      itemStyle: {
        borderWidth: 0.5,
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
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        formatter: (value: string) => value.slice(5), // 只显示月-日
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: counts,
        type: 'line',
        smooth: true,
        areaStyle: {},
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

  const data = Object.entries(moodCounts).map(([mood, count]) => ({
    name: moodMap[mood] || mood,
    value: count,
  }))

  pieChart.setOption({
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
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
  <div>
    <h1 class="mb-6 text-2xl font-bold">
      数据统计
    </h1>

    <!-- 统计卡片 -->
    <div class="grid mb-8 gap-4 md:grid-cols-3">
      <div class="card">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          总打卡天数
        </div>
        <div class="mt-2 text-3xl font-bold">
          {{ statistics.totalCheckIns }}
        </div>
      </div>
      <div class="card">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          当前连续打卡
        </div>
        <div class="mt-2 text-3xl font-bold">
          {{ statistics.consecutiveDays }}
        </div>
      </div>
      <div class="card">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          最长连续打卡
        </div>
        <div class="mt-2 text-3xl font-bold">
          {{ statistics.longestStreak }}
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="space-y-8">
      <!-- 热力图 -->
      <div class="card">
        <h2 class="mb-4 text-lg font-bold">
          打卡热力图
        </h2>
        <div ref="heatmapRef" class="h-64 w-full" />
      </div>

      <!-- 打卡趋势 -->
      <div class="card">
        <h2 class="mb-4 text-lg font-bold">
          打卡趋势
        </h2>
        <div ref="lineChartRef" class="h-64 w-full" />
      </div>

      <!-- 心情分布 -->
      <div class="card">
        <h2 class="mb-4 text-lg font-bold">
          心情分布
        </h2>
        <div ref="pieChartRef" class="h-64 w-full" />
      </div>
    </div>
  </div>
</template>

<style>
</style>
