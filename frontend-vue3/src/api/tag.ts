// 引入封装好的 axios 实例
import request from '@/utils/request'

// 全部标签：GET /api/tag/list
export const apiTagList = () => request.get('/tag/list')

// 新增标签：POST /api/tag/add
export const apiTagAdd = (data: { name: string }) => request.post('/tag/add', data)
