<script setup lang="ts">
// 引入响应式与生命周期
import { ref, onMounted } from 'vue'
// 引入分类接口
import { apiCategoryList, apiCategoryAdd } from '@/api/category'
// 引入标签接口
import { apiTagList, apiTagAdd } from '@/api/tag'
// 引入消息提示
import { ElMessage } from 'element-plus'

// 分类列表
const categories = ref<any[]>([])
// 标签列表
const tags = ref<any[]>([])
// 新增分类的名称
const newCategory = ref('')
// 新增分类的排序值
const newCategorySort = ref(0)
// 新增标签的名称
const newTag = ref('')

// 加载分类列表
const loadCategories = async () => {
  // 调用分类接口
  categories.value = await apiCategoryList()
}

// 加载标签列表
const loadTags = async () => {
  // 调用标签接口
  tags.value = await apiTagList()
}

// 新增分类
const addCategory = async () => {
  // 校验非空
  if (!newCategory.value.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }
  // 调用新增接口
  await apiCategoryAdd({ name: newCategory.value, sort: newCategorySort.value })
  // 提示
  ElMessage.success('分类新增成功')
  // 清空输入
  newCategory.value = ''
  newCategorySort.value = 0
  // 刷新列表
  loadCategories()
}

// 新增标签
const addTag = async () => {
  // 校验非空
  if (!newTag.value.trim()) {
    ElMessage.warning('请输入标签名称')
    return
  }
  // 调用新增接口
  await apiTagAdd({ name: newTag.value })
  // 提示
  ElMessage.success('标签新增成功')
  // 清空输入
  newTag.value = ''
  // 刷新列表
  loadTags()
}

// 页面挂载时加载数据
onMounted(() => {
  loadCategories() // 加载分类
  loadTags() // 加载标签
})
</script>

<template>
  <!-- 页面整体，左右两栏 -->
  <div class="ct-wrap">
    <!-- 分类管理卡片 -->
    <el-card class="ct-card">
      <template #header>分类管理</template>
      <!-- 新增分类输入区 -->
      <div class="add-row">
        <!-- 分类名称 -->
        <el-input v-model="newCategory" placeholder="分类名称" style="width: 160px" />
        <!-- 排序值 -->
        <el-input-number v-model="newCategorySort" :min="0" placeholder="排序" />
        <!-- 新增按钮 -->
        <el-button type="primary" @click="addCategory">新增</el-button>
      </div>
      <!-- 分类表格 -->
      <el-table :data="categories" border stripe>
        <!-- ID 列 -->
        <el-table-column prop="id" label="ID" width="70" />
        <!-- 名称列 -->
        <el-table-column prop="name" label="分类名称" />
        <!-- 排序列 -->
        <el-table-column prop="sort" label="排序" width="90" />
      </el-table>
    </el-card>

    <!-- 标签管理卡片 -->
    <el-card class="ct-card">
      <template #header>标签管理</template>
      <!-- 新增标签输入区 -->
      <div class="add-row">
        <!-- 标签名称 -->
        <el-input v-model="newTag" placeholder="标签名称" style="width: 200px" />
        <!-- 新增按钮 -->
        <el-button type="primary" @click="addTag">新增</el-button>
      </div>
      <!-- 标签展示区 -->
      <div class="tag-list">
        <!-- 标签为空 -->
        <el-empty v-if="tags.length === 0" description="暂无标签" :image-size="60" />
        <!-- 各标签 -->
        <el-tag v-for="t in tags" :key="t.id" class="tag-item" size="large">
          {{ t.name }}
        </el-tag>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
/* 两栏布局 */
.ct-wrap {
  display: flex; /* 横向 */
  gap: 20px; /* 间距 */
  align-items: flex-start; /* 顶部对齐 */
}
/* 卡片各占一半 */
.ct-card {
  flex: 1; /* 自适应 */
}
/* 新增输入区 */
.add-row {
  display: flex; /* 横向 */
  gap: 10px; /* 间距 */
  margin-bottom: 16px; /* 下间距 */
}
/* 标签展示区 */
.tag-list {
  display: flex; /* 横向 */
  flex-wrap: wrap; /* 换行 */
  gap: 10px; /* 间距 */
}
/* 单个标签间距 */
.tag-item {
  margin: 2px; /* 外边距 */
}
</style>
