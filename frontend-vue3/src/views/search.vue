<script setup lang="ts">
// 引入响应式
import { ref } from 'vue'
// 引入路由跳转
import { useRouter } from 'vue-router'
// 引入文章搜索接口
import { apiArticleSearch } from '@/api/article'
// 引入消息提示
import { ElMessage } from 'element-plus'

// 路由实例
const router = useRouter()

// 搜索关键词
const keyword = ref('')
// 搜索结果列表
const results = ref<any[]>([])
// 是否已执行过搜索
const searched = ref(false)

// 执行搜索
const handleSearch = async () => {
  // 关键词为空提示
  if (!keyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  // 调用搜索接口
  const res: any = await apiArticleSearch({ keyword: keyword.value })
  // 保存结果
  results.value = res.list
  // 标记已搜索
  searched.value = true
}

// 跳转详情
const goDetail = (id: number) => router.push(`/article/${id}`)
</script>

<template>
  <!-- 页面容器 -->
  <div class="page-container">
    <!-- 搜索框区域 -->
    <div class="search-bar">
      <!-- 关键词输入框，回车触发搜索 -->
      <el-input
        v-model="keyword"
        placeholder="输入文章标题关键词搜索"
        size="large"
        clearable
        @keyup.enter="handleSearch"
      >
        <!-- 输入框后置搜索按钮 -->
        <template #append>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <!-- 搜索结果区域 -->
    <div class="result">
      <!-- 已搜索且无结果 -->
      <el-empty v-if="searched && results.length === 0" description="没有找到相关文章" />
      <!-- 结果列表 -->
      <el-card
        v-for="a in results"
        :key="a.id"
        class="result-item"
        shadow="hover"
        @click="goDetail(a.id)"
      >
        <!-- 标题 -->
        <h3>{{ a.title }}</h3>
        <!-- 摘要 -->
        <p class="summary">{{ a.summary || a.content?.slice(0, 80) }}</p>
        <!-- 元信息 -->
        <div class="meta">
          <span>作者：{{ a.authorName }}</span>
          <span>浏览：{{ a.viewCount }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
/* 搜索框区域 */
.search-bar {
  max-width: 600px; /* 限宽 */
  margin: 20px auto 30px; /* 居中并留间距 */
}
/* 单条结果 */
.result-item {
  margin-bottom: 14px; /* 下间距 */
  cursor: pointer; /* 手型 */
}
/* 摘要样式 */
.summary {
  color: #909399; /* 灰色 */
  margin: 8px 0; /* 上下间距 */
  font-size: 14px; /* 字号 */
}
/* 元信息样式 */
.meta {
  display: flex; /* 横向 */
  gap: 18px; /* 间距 */
  color: #c0c4cc; /* 浅灰 */
  font-size: 13px; /* 字号 */
}
</style>
