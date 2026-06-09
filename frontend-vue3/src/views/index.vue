<script setup lang="ts">
// 引入响应式与生命周期
import { ref, onMounted } from 'vue'
// 引入路由跳转
import { useRouter } from 'vue-router'
// 引入文章接口
import { apiArticleList, apiArticleTop } from '@/api/article'
// 引入分类接口
import { apiCategoryList } from '@/api/category'

// 路由实例
const router = useRouter()

// 文章列表数据
const articles = ref<any[]>([])
// 分类列表数据
const categories = ref<any[]>([])
// 热门(置顶)文章数据
const topArticles = ref<any[]>([])
// 当前选中的分类ID（0 表示全部）
const currentCategory = ref<number>(0)
// 当前页码
const page = ref(1)
// 每页条数
const pageSize = ref(5)
// 文章总数
const total = ref(0)

// 加载文章列表
const loadArticles = async () => {
  // 调用列表接口（带分类过滤）
  const res: any = await apiArticleList({
    page: page.value, // 当前页
    pageSize: pageSize.value, // 每页条数
    categoryId: currentCategory.value || undefined, // 分类(0时不传)
  })
  // 保存列表与总数
  articles.value = res.list
  total.value = res.total
}

// 加载分类列表
const loadCategories = async () => {
  // 调用分类接口
  categories.value = await apiCategoryList()
}

// 加载热门文章
const loadTop = async () => {
  // 调用置顶文章接口
  topArticles.value = await apiArticleTop()
}

// 切换分类
const selectCategory = (id: number) => {
  // 更新当前分类
  currentCategory.value = id
  // 重置到第一页
  page.value = 1
  // 重新加载列表
  loadArticles()
}

// 分页变化时重新加载
const handlePageChange = (p: number) => {
  // 更新页码
  page.value = p
  // 重新加载
  loadArticles()
}

// 跳转到文章详情
const goDetail = (id: number) => router.push(`/article/${id}`)

// 页面挂载时并行加载数据
onMounted(() => {
  loadArticles() // 加载文章
  loadCategories() // 加载分类
  loadTop() // 加载热门
})
</script>

<template>
  <!-- 页面容器，左右两栏布局 -->
  <div class="page-container home">
    <!-- 左侧主内容 -->
    <div class="left">
      <!-- 分类导航 -->
      <div class="category-nav">
        <!-- 全部按钮 -->
        <span :class="['cat', currentCategory === 0 && 'active']" @click="selectCategory(0)">
          全部
        </span>
        <!-- 各分类按钮 -->
        <span
          v-for="c in categories"
          :key="c.id"
          :class="['cat', currentCategory === c.id && 'active']"
          @click="selectCategory(c.id)"
        >
          {{ c.name }}
        </span>
      </div>

      <!-- 文章列表 -->
      <div class="article-list">
        <!-- 空状态 -->
        <el-empty v-if="articles.length === 0" description="暂无文章" />
        <!-- 文章卡片 -->
        <el-card
          v-for="a in articles"
          :key="a.id"
          class="article-card"
          shadow="hover"
          @click="goDetail(a.id)"
        >
          <div class="card-inner">
            <!-- 封面图 -->
            <img v-if="a.cover" :src="a.cover" class="cover" alt="封面" />
            <!-- 文本信息 -->
            <div class="info">
              <!-- 标题 + 置顶标记 -->
              <h3 class="title">
                <el-tag v-if="a.isTop === 1" type="danger" size="small">置顶</el-tag>
                {{ a.title }}
              </h3>
              <!-- 摘要 -->
              <p class="summary">{{ a.summary || a.content?.slice(0, 80) }}</p>
              <!-- 元信息 -->
              <div class="meta">
                <span>分类：{{ a.categoryName || '未分类' }}</span>
                <span>作者：{{ a.authorName }}</span>
                <span>浏览：{{ a.viewCount }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 分页器 -->
      <el-pagination
        v-if="total > pageSize"
        class="pager"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 右侧侧边栏 -->
    <aside class="right">
      <!-- 热门文章卡片 -->
      <el-card class="hot-card">
        <template #header>🔥 热门文章</template>
        <!-- 热门列表为空 -->
        <el-empty v-if="topArticles.length === 0" description="暂无" :image-size="60" />
        <!-- 热门列表 -->
        <ul class="hot-list">
          <li v-for="t in topArticles" :key="t.id" @click="goDetail(t.id)">
            {{ t.title }}
          </li>
        </ul>
      </el-card>
    </aside>
  </div>
</template>

<style scoped>
/* 首页两栏布局 */
.home {
  display: flex; /* 弹性布局 */
  gap: 20px; /* 两栏间距 */
  align-items: flex-start; /* 顶部对齐 */
}
/* 左侧占满剩余空间 */
.left {
  flex: 1; /* 自适应 */
}
/* 右侧固定宽度 */
.right {
  width: 260px; /* 宽度 */
}
/* 分类导航 */
.category-nav {
  background: #fff; /* 白底 */
  padding: 14px; /* 内边距 */
  border-radius: 8px; /* 圆角 */
  margin-bottom: 16px; /* 下间距 */
  display: flex; /* 横向排列 */
  flex-wrap: wrap; /* 可换行 */
  gap: 10px; /* 间距 */
}
/* 单个分类标签 */
.cat {
  padding: 4px 14px; /* 内边距 */
  border-radius: 16px; /* 胶囊圆角 */
  cursor: pointer; /* 手型 */
  color: #606266; /* 默认颜色 */
  background: #f0f2f5; /* 默认背景 */
  font-size: 14px; /* 字号 */
}
/* 选中分类高亮 */
.cat.active {
  background: #409eff; /* 主题色背景 */
  color: #fff; /* 白色文字 */
}
/* 文章卡片间距 */
.article-card {
  margin-bottom: 16px; /* 下间距 */
  cursor: pointer; /* 手型 */
}
/* 卡片内部布局 */
.card-inner {
  display: flex; /* 横向布局 */
  gap: 16px; /* 间距 */
}
/* 封面图样式 */
.cover {
  width: 140px; /* 宽度 */
  height: 90px; /* 高度 */
  object-fit: cover; /* 裁剪填充 */
  border-radius: 6px; /* 圆角 */
}
/* 文本信息占满 */
.info {
  flex: 1; /* 自适应 */
}
/* 标题样式 */
.title {
  font-size: 18px; /* 字号 */
  margin-bottom: 8px; /* 下间距 */
  color: #303133; /* 颜色 */
}
/* 摘要样式 */
.summary {
  color: #909399; /* 灰色 */
  font-size: 14px; /* 字号 */
  margin-bottom: 10px; /* 下间距 */
  line-height: 1.6; /* 行高 */
}
/* 元信息样式 */
.meta {
  display: flex; /* 横向 */
  gap: 18px; /* 间距 */
  color: #c0c4cc; /* 浅灰 */
  font-size: 13px; /* 字号 */
}
/* 分页器居中 */
.pager {
  justify-content: center; /* 居中 */
  margin-top: 10px; /* 上间距 */
}
/* 热门列表 */
.hot-list {
  list-style: none; /* 去除项目符号 */
}
/* 热门列表项 */
.hot-list li {
  padding: 8px 0; /* 上下内边距 */
  border-bottom: 1px dashed #ebeef5; /* 虚线分隔 */
  cursor: pointer; /* 手型 */
  font-size: 14px; /* 字号 */
  color: #606266; /* 颜色 */
}
/* 鼠标悬停高亮 */
.hot-list li:hover {
  color: #409eff; /* 主题色 */
}
</style>
