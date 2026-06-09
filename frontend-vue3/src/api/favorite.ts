// 引入封装好的 axios 实例
import request from '@/utils/request'

// 收藏 / 取消收藏：POST /api/favorite/add
export const apiFavoriteToggle = (data: { articleId: number }) => request.post('/favorite/add', data)

// 我的收藏列表：GET /api/favorite/list
export const apiFavoriteList = () => request.get('/favorite/list')
