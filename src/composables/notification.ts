import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

// 显示成功消息
export function showSuccess(message: string) {
  ElMessage({
    message,
    type: 'success',
    duration: 2000,
  })
}

// 显示错误消息
export function showError(message: string) {
  ElMessage({
    message,
    type: 'error',
    duration: 3000,
  })
}

// 显示警告消息
export function showWarning(message: string) {
  ElMessage({
    message,
    type: 'warning',
    duration: 3000,
  })
}

// 显示信息消息
export function showInfo(message: string) {
  ElMessage({
    message,
    type: 'info',
    duration: 2000,
  })
}

// 显示通知
export function showNotification(title: string, message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') {
  ElNotification({
    title,
    message,
    type,
    duration: 3000,
  })
}

// 显示确认对话框
export function showConfirmDialog(message: string, title: string = '提示', type: 'warning' | 'info' | 'success' | 'error' = 'warning') {
  return ElMessageBox.confirm(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type,
  })
}
