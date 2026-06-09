// 引入封装好的 axios 实例
import request from '@/utils/request'

// 用户注册：POST /api/user/register
export const apiRegister = (data: { username: string; password: string; nickname?: string; email?: string }) =>
  request.post('/user/register', data)

// 用户登录：POST /api/user/login
export const apiLogin = (data: { username: string; password: string }) =>
  request.post('/user/login', data)

// 获取个人信息：GET /api/user/info
export const apiGetUserInfo = () => request.get('/user/info')

// 修改个人资料：PUT /api/user/info
export const apiUpdateUserInfo = (data: { nickname?: string; avatar?: string; email?: string }) =>
  request.put('/user/info', data)

// 退出登录：POST /api/user/logout
export const apiLogout = () => request.post('/user/logout')
