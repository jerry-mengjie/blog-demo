// 引入 pinia 的 defineStore
import { defineStore } from 'pinia'
// 引入 vue 的响应式与计算属性
import { ref, computed } from 'vue'
// 引入用户相关接口
import { apiLogin, apiLogout, apiGetUserInfo } from '@/api/user'

// 用户信息类型定义
interface UserInfo {
  id: number // 用户ID
  username: string // 用户名
  nickname: string // 昵称
  avatar?: string // 头像
  isAdmin: number // 是否管理员
}

// 定义用户状态仓库
export const useUserStore = defineStore('user', () => {
  // 登录令牌，初始值从本地存储读取
  const token = ref<string>(localStorage.getItem('token') || '')
  // 用户信息，初始值从本地存储解析
  const userInfo = ref<UserInfo | null>(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null,
  )

  // 计算属性：是否已登录
  const isLogin = computed(() => !!token.value)
  // 计算属性：是否为管理员
  const isAdmin = computed(() => userInfo.value?.isAdmin === 1)

  // 登录动作：调用接口并保存令牌与用户信息
  const login = async (username: string, password: string) => {
    // 调用登录接口
    const res: any = await apiLogin({ username, password })
    // 保存 token 到内存与本地
    token.value = res.token
    localStorage.setItem('token', res.token)
    // 保存用户信息到内存与本地
    userInfo.value = res.userInfo
    localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
    // 返回登录结果
    return res
  }

  // 刷新个人信息动作
  const fetchUserInfo = async () => {
    // 调用获取个人信息接口
    const res: any = await apiGetUserInfo()
    // 合并更新用户信息（保留 isAdmin 等字段）
    userInfo.value = { ...(userInfo.value as UserInfo), ...res }
    // 同步到本地存储
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    // 返回结果
    return res
  }

  // 退出登录动作
  const logout = async () => {
    // 尝试调用后端退出接口（失败也不影响本地清理）
    try {
      await apiLogout()
    } catch {
      // 忽略错误
    }
    // 清空内存中的令牌与用户信息
    token.value = ''
    userInfo.value = null
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 暴露状态与方法
  return { token, userInfo, isLogin, isAdmin, login, fetchUserInfo, logout }
})
