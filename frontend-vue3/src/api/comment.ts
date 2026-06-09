// 引入封装好的 axios 实例
import request from '@/utils/request'

// 文章评论列表：GET /api/comment/list/:articleId
export const apiCommentList = (articleId: number) => request.get(`/comment/list/${articleId}`)

// 发表评论：POST /api/comment/add
export const apiCommentAdd = (data: { articleId: number; content: string; parentId?: number }) =>
  request.post('/comment/add', data)

// 删除评论：DELETE /api/comment/del/:id
export const apiCommentDel = (id: number) => request.delete(`/comment/del/${id}`)
