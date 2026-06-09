<script setup lang="ts">
// 引入响应式与生命周期
import { ref, onMounted } from 'vue'
// 引入路由参数
import { useRoute } from 'vue-router'
// 引入文章详情接口
import { apiArticleDetail } from '@/api/article'
// 引入评论接口
import { apiCommentList, apiCommentAdd, apiCommentDel } from '@/api/comment'
// 引入收藏接口
import { apiFavoriteToggle } from '@/api/favorite'
// 引入用户仓库
import { useUserStore } from '@/stores/user'
// 引入消息提示与确认框
import { ElMessage, ElMessageBox } from 'element-plus'

// 路由实例（取 id 参数）
const route = useRoute()
// 用户仓库
const userStore = useUserStore()
// 文章ID（从路由参数转数字）
const articleId = Number(route.params.id)

// 文章详情数据
const article = ref<any>(null)
// 评论列表数据
const comments = ref<any[]>([])
// 评论输入框内容
const commentText = ref('')
// 是否已收藏（本地标记）
const favorited = ref(false)

// 加载文章详情
const loadDetail = async () => {
  // 调用详情接口
  article.value = await apiArticleDetail(articleId)
}

// 加载评论列表
const loadComments = async () => {
  // 调用评论列表接口
  comments.value = await apiCommentList(articleId)
}

// 提交评论
const submitComment = async () => {
  // 未登录则提示
  if (!userStore.isLogin) {
    ElMessage.warning('请先登录后再评论')
    return
  }
  // 内容为空则提示
  if (!commentText.value.trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }
  // 调用发表评论接口
  await apiCommentAdd({ articleId, content: commentText.value })
  // 提示成功
  ElMessage.success('评论成功')
  // 清空输入框
  commentText.value = ''
  // 重新加载评论
  loadComments()
}

// 删除评论
const delComment = async (id: number) => {
  // 二次确认
  await ElMessageBox.confirm('确定删除该评论吗？', '提示', { type: 'warning' })
  // 调用删除接口
  await apiCommentDel(id)
  // 提示
  ElMessage.success('删除成功')
  // 重新加载评论
  loadComments()
}

// 收藏 / 取消收藏
const toggleFavorite = async () => {
  // 未登录提示
  if (!userStore.isLogin) {
    ElMessage.warning('请先登录后再收藏')
    return
  }
  // 调用收藏切换接口
  const res: any = await apiFavoriteToggle({ articleId })
  // 更新本地收藏状态
  favorited.value = res.favorited
  // 根据结果提示
  ElMessage.success(res.favorited ? '收藏成功' : '已取消收藏')
}

// 页面挂载时加载数据
onMounted(() => {
  loadDetail() // 加载文章
  loadComments() // 加载评论
})
</script>

<template>
  <!-- 页面容器 -->
  <div class="page-container" v-if="article">
    <!-- 文章正文卡片 -->
    <el-card class="article-box">
      <!-- 标题 -->
      <h1 class="title">{{ article.title }}</h1>
      <!-- 元信息 -->
      <div class="meta">
        <span>作者：{{ article.authorName }}</span>
        <span>分类：{{ article.categoryName || '未分类' }}</span>
        <span>浏览：{{ article.viewCount }}</span>
        <!-- 收藏按钮 -->
        <el-button size="small" :type="favorited ? 'warning' : 'default'" @click="toggleFavorite">
          {{ favorited ? '★ 已收藏' : '☆ 收藏' }}
        </el-button>
      </div>
      <!-- 标签列表 -->
      <div class="tags" v-if="article.tags?.length">
        <el-tag v-for="t in article.tags" :key="t.id" size="small" type="info">
          {{ t.name }}
        </el-tag>
      </div>
      <!-- 正文内容（保留换行） -->
      <div class="content">{{ article.content }}</div>
    </el-card>

    <!-- 评论区卡片 -->
    <el-card class="comment-box">
      <template #header>评论区（{{ comments.length }}）</template>

      <!-- 评论输入区 -->
      <div class="comment-input">
        <el-input
          v-model="commentText"
          type="textarea"
          :rows="3"
          placeholder="写下你的评论..."
        />
        <el-button type="primary" class="submit-btn" @click="submitComment">发表评论</el-button>
      </div>

      <!-- 评论列表为空 -->
      <el-empty v-if="comments.length === 0" description="暂无评论，快来抢沙发吧" />

      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-for="c in comments" :key="c.id" class="comment-item">
          <!-- 评论头部 -->
          <div class="comment-head">
            <span class="nickname">{{ c.nickname }}</span>
            <span class="time">{{ new Date(c.createTime).toLocaleString() }}</span>
            <!-- 本人或管理员可删除 -->
            <el-button
              v-if="userStore.userInfo?.id === c.userId || userStore.isAdmin"
              type="danger"
              size="small"
              link
              @click="delComment(c.id)"
            >
              删除
            </el-button>
          </div>
          <!-- 评论内容 -->
          <div class="comment-content">{{ c.content }}</div>
          <!-- 子评论（回复） -->
          <div v-for="child in c.children" :key="child.id" class="reply-item">
            <span class="nickname">{{ child.nickname }}：</span>
            <span>{{ child.content }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
/* 文章卡片下间距 */
.article-box {
  margin-bottom: 20px; /* 下间距 */
}
/* 标题样式 */
.title {
  font-size: 26px; /* 字号 */
  margin-bottom: 14px; /* 下间距 */
}
/* 元信息样式 */
.meta {
  display: flex; /* 横向 */
  align-items: center; /* 垂直居中 */
  gap: 18px; /* 间距 */
  color: #909399; /* 灰色 */
  font-size: 14px; /* 字号 */
  margin-bottom: 14px; /* 下间距 */
}
/* 标签区 */
.tags {
  display: flex; /* 横向 */
  gap: 8px; /* 间距 */
  margin-bottom: 18px; /* 下间距 */
}
/* 正文内容样式（保留空白与换行） */
.content {
  line-height: 1.9; /* 行高 */
  font-size: 16px; /* 字号 */
  color: #303133; /* 颜色 */
  white-space: pre-wrap; /* 保留换行 */
}
/* 评论输入区 */
.comment-input {
  margin-bottom: 20px; /* 下间距 */
}
/* 提交按钮间距 */
.submit-btn {
  margin-top: 10px; /* 上间距 */
}
/* 单条评论 */
.comment-item {
  padding: 14px 0; /* 上下内边距 */
  border-bottom: 1px solid #f0f2f5; /* 分隔线 */
}
/* 评论头部 */
.comment-head {
  display: flex; /* 横向 */
  align-items: center; /* 垂直居中 */
  gap: 12px; /* 间距 */
  margin-bottom: 6px; /* 下间距 */
}
/* 昵称样式 */
.nickname {
  font-weight: bold; /* 加粗 */
  color: #409eff; /* 主题色 */
}
/* 时间样式 */
.time {
  color: #c0c4cc; /* 浅灰 */
  font-size: 12px; /* 字号 */
}
/* 评论内容 */
.comment-content {
  color: #303133; /* 颜色 */
  line-height: 1.6; /* 行高 */
}
/* 回复项样式 */
.reply-item {
  margin-top: 8px; /* 上间距 */
  margin-left: 20px; /* 缩进 */
  padding: 8px 12px; /* 内边距 */
  background: #f7f8fa; /* 浅灰底 */
  border-radius: 6px; /* 圆角 */
  font-size: 14px; /* 字号 */
}
</style>
