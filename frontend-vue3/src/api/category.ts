// 引入封装好的 axios 实例
import request from '@/utils/request'

// 全部分类：GET /api/category/list
export const apiCategoryList = () => request.get('/category/list')

// 新增分类：POST /api/category/add
export const apiCategoryAdd = (data: { name: string; sort?: number }) =>
  request.post('/category/add', data)
