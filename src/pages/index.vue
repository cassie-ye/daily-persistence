<script setup lang="ts">
import type { CheckIn, Plan } from '~/types'

const plans = usePlans()
const checkIns = useCheckIns()

// 计算活跃的计划（未归档）
const activePlans = computed(() => {
  return plans.value.filter(plan => !plan.isArchived)
})

// 添加/编辑计划相关
const showAddPlanDialog = ref(false)
const showConfirmDialog = ref(false)
const confirmCallback = ref<() => void>(() => {})
const confirmMessage = ref('')
const editingPlan = ref<Plan | null>(null)
const newPlan = ref<Partial<Plan>>({
  name: '',
  description: '',
  startDate: formatDate(new Date()),
  endDate: '',
  goal: '',
})

function showConfirm(message: string, callback: () => void) {
  confirmMessage.value = message
  confirmCallback.value = callback
  showConfirmDialog.value = true
}

function editPlan(plan: Plan) {
  editingPlan.value = plan
  newPlan.value = { ...plan }
  showAddPlanDialog.value = true
}

function archivePlan(plan: Plan) {
  showConfirm('确定要归档这个计划吗？', () => {
    const index = plans.value.findIndex(p => p.id === plan.id)
    if (index !== -1) {
      plans.value[index] = {
        ...plan,
        isArchived: true,
        updatedAt: new Date().toISOString(),
      }
    }
  })
}

function savePlan() {
  const now = new Date().toISOString()
  if (editingPlan.value) {
    // 更新计划
    const index = plans.value.findIndex(p => p.id === editingPlan.value!.id)
    if (index !== -1) {
      plans.value[index] = {
        ...editingPlan.value,
        ...newPlan.value,
        updatedAt: now,
      } as Plan
    }
  }
  else {
    // 添加新计划
    plans.value.push({
      ...newPlan.value,
      id: generateId(),
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    } as Plan)
  }

  // 重置表单
  editingPlan.value = null
  newPlan.value = {
    name: '',
    description: '',
    startDate: formatDate(new Date()),
    endDate: '',
    goal: '',
  }
  showAddPlanDialog.value = false
}

// 打卡相关
const showCheckInDialog = ref(false)
const currentPlan = ref<Plan | null>(null)
const newCheckIn = ref<Partial<CheckIn>>({
  time: formatTime(new Date()),
  mood: 'happy',
  weather: 'sunny',
  notes: '',
})

function showCheckInDialogForPlan(plan: Plan) {
  currentPlan.value = plan
  newCheckIn.value = {
    time: formatTime(new Date()),
    mood: 'happy',
    weather: 'sunny',
    notes: '',
  }
  showCheckInDialog.value = true
}

function saveCheckIn() {
  if (!currentPlan.value)
    return

  const now = new Date().toISOString()
  checkIns.value.push({
    ...newCheckIn.value,
    id: generateId(),
    planId: currentPlan.value.id,
    date: formatDate(new Date()),
    createdAt: now,
  } as CheckIn)

  showCheckInDialog.value = false
  currentPlan.value = null
}
</script>

<template>
  <div class="pb-16">
    <!-- 添加计划按钮 -->
    <div class="mb-4 flex justify-end">
      <button
        class="btn-primary"
        @click="showAddPlanDialog = true"
      >
        <div i-carbon-add class="mr-1" />
        新建计划
      </button>
    </div>

    <!-- 计划列表 -->
    <div class="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
      <div
        v-for="plan in activePlans"
        :key="plan.id"
        class="card"
      >
        <div class="flex items-start justify-between">
          <h3 class="text-lg font-bold">
            {{ plan.name }}
          </h3>
          <div class="flex gap-2">
            <button class="icon-btn" @click="editPlan(plan)">
              <div i-carbon-edit />
            </button>
            <button class="icon-btn" @click="archivePlan(plan)">
              <div i-carbon-archive />
            </button>
          </div>
        </div>

        <p v-if="plan.description" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ plan.description }}
        </p>

        <div class="mt-4">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            开始时间：{{ formatDate(new Date(plan.startDate)) }}
          </div>
          <div v-if="plan.endDate" class="text-sm text-gray-600 dark:text-gray-400">
            结束时间：{{ formatDate(new Date(plan.endDate)) }}
          </div>
        </div>

        <div class="mt-4">
          <button
            class="w-full btn-primary"
            @click="showCheckInDialogForPlan(plan)"
          >
            打卡
          </button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑计划对话框 -->
    <Teleport to="body">
      <div
        v-if="showAddPlanDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="showAddPlanDialog = false"
      >
        <div class="max-w-md w-full rounded-lg bg-white p-6 dark:bg-gray-800">
          <h2 class="mb-4 text-xl font-bold">
            {{ editingPlan ? '编辑计划' : '新建计划' }}
          </h2>

          <form @submit.prevent="savePlan">
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-medium">计划名称</label>
                <input
                  v-model="newPlan.name"
                  type="text"
                  class="w-full input"
                  required
                >
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium">计划描述</label>
                <textarea
                  v-model="newPlan.description"
                  class="w-full input"
                  rows="3"
                />
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium">开始时间</label>
                <input
                  v-model="newPlan.startDate"
                  type="date"
                  class="w-full input"
                  required
                >
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium">结束时间（可选）</label>
                <input
                  v-model="newPlan.endDate"
                  type="date"
                  class="w-full input"
                >
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium">目标（可选）</label>
                <input
                  v-model="newPlan.goal"
                  type="text"
                  class="w-full input"
                >
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-2">
              <button
                type="button"
                class="btn"
                @click="showAddPlanDialog = false"
              >
                取消
              </button>
              <button
                type="submit"
                class="btn-primary"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- 打卡对话框 -->
    <Teleport to="body">
      <div
        v-if="showCheckInDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="showCheckInDialog = false"
      >
        <div class="max-w-md w-full rounded-lg bg-white p-6 dark:bg-gray-800">
          <h2 class="mb-4 text-xl font-bold">
            打卡
          </h2>

          <form @submit.prevent="saveCheckIn">
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-medium">打卡时间</label>
                <input
                  v-model="newCheckIn.time"
                  type="time"
                  step="1"
                  class="w-full input"
                  required
                >
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium">心情</label>
                <select
                  v-model="newCheckIn.mood"
                  class="w-full input"
                  required
                >
                  <option value="happy">
                    开心 😊
                  </option>
                  <option value="normal">
                    一般 😐
                  </option>
                  <option value="sad">
                    难过 😢
                  </option>
                  <option value="angry">
                    生气 😠
                  </option>
                  <option value="excited">
                    兴奋 🤩
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium">天气（可选）</label>
                <select
                  v-model="newCheckIn.weather"
                  class="w-full input"
                >
                  <option value="sunny">
                    晴天 ☀️
                  </option>
                  <option value="cloudy">
                    多云 ⛅
                  </option>
                  <option value="rainy">
                    下雨 🌧️
                  </option>
                  <option value="snowy">
                    下雪 🌨️
                  </option>
                  <option value="windy">
                    刮风 💨
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium">备注（可选）</label>
                <textarea
                  v-model="newCheckIn.notes"
                  class="w-full input"
                  rows="3"
                />
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-2">
              <button
                type="button"
                class="btn"
                @click="showCheckInDialog = false"
              >
                取消
              </button>
              <button
                type="submit"
                class="btn-primary"
              >
                打卡
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- 确认对话框 -->
    <Teleport to="body">
      <div
        v-if="showConfirmDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="showConfirmDialog = false"
      >
        <div class="max-w-sm w-full rounded-lg bg-white p-6 dark:bg-gray-800">
          <p class="mb-4 text-center">
            {{ confirmMessage }}
          </p>
          <div class="flex justify-center gap-2">
            <button
              class="btn"
              @click="showConfirmDialog = false"
            >
              取消
            </button>
            <button
              class="btn-primary"
              @click="() => {
                confirmCallback()
                showConfirmDialog = false
              }"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<style>
</style>
