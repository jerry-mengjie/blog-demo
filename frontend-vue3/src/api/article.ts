// 引入封装好的 axios 实例
import request from '@/utils/request'

// 分页查询文章列表：GET /api/article/list
export const apiArticleList = (params: { page?: number; pageSize?: number; categoryId?: number }) =>
  request.get('/article/list', { params })

// 文章详情：GET /api/article/detail/:id
export const apiArticleDetail = (id: number) => request.get(`/article/detail/${id}`)

// 发布文章：POST /api/article/add
export const apiArticleAdd = (data: any) => request.post('/article/add', data)

// 编辑文章：PUT /api/article/update/:id
export const apiArticleUpdate = (id: number, data: any) => request.put(`/article/update/${id}`, data)

// 删除文章：DELETE /api/article/del/:id
export const apiArticleDel = (id: number) => request.delete(`/article/del/${id}`)

// 置顶文章列表：GET /api/article/top
export const apiArticleTop = () => request.get('/article/top')

// 文章搜索：GET /api/article/search
export const apiArticleSearch = (params: { keyword: string; page?: number; pageSize?: number }) =>
  request.get('/article/search', { params })
