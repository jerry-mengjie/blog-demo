<script setup lang="ts">
// 引入响应式与生命周期
import { ref, reactive, onMounted } from 'vue'
// 引入文章接口
import { apiArticleList, apiArticleAdd, apiArticleUpdate, apiArticleDel, apiArticleDetail } from '@/api/article'
// 引入分类与标签接口
import { apiCategoryList } from '@/api/category'
import { apiTagList } from '@/api/tag'
// 引入消息提示与确认框
import { ElMessage, ElMessageBox } from 'element-plus'

// 文章列表
const articles = ref<any[]>([])
// 分类下拉数据
const categories = ref<any[]>([])
// 标签下拉数据
const tags = ref<any[]>([])
// 当前页码
const page = ref(1)
// 每页条数
const pageSize = ref(10)
// 总条数
const total = ref(0)

// 弹窗显示控制
const dialogVisible = ref(false)
// 当前是否为编辑模式
const isEdit = ref(false)
// 正在编辑的文章ID
const editId = ref<number>(0)
// 表单数据
const form = reactive<any>({
  title: '', // 标题
  content: '', // 正文
  cover: '', // 封面
  summary: '', // 摘要
  categoryId: undefined, // 分类
  tagIds: [], // 标签数组
  isTop: 0, // 是否置顶
})

// 加载文章列表
const loadArticles = async () => {
  // 调用列表接口
  const res: any = await apiArticleList({ page: page.value, pageSize: pageSize.value })
  // 保存数据
  articles.value = res.list
  total.value = res.total
}

// 加载分类与标签下拉
const loadOptions = async () => {
  // 并行加载分类与标签
  categories.value = await apiCategoryList()
  tags.value = await apiTagList()
}

// 重置表单
const resetForm = () => {
  // 逐项清空
  form.title = ''
  form.content = ''
  form.cover = ''
  form.summary = ''
  form.categoryId = undefined
  form.tagIds = []
  form.isTop = 0
}

// 打开新增弹窗
const openAdd = () => {
  // 设为新增模式
  isEdit.value = false
  // 重置表单
  resetForm()
  // 显示弹窗
  dialogVisible.value = true
}

// 打开编辑弹窗
const openEdit = async (id: number) => {
  // 设为编辑模式
  isEdit.value = true
  // 记录编辑ID
  editId.value = id
  // 获取文章详情
  const res: any = await apiArticleDetail(id)
  // 回填表单字段
  form.title = res.title
  form.content = res.content
  form.cover = res.cover
  form.summary = res.summary
  form.categoryId = res.categoryId
  // 标签回填为ID数组
  form.tagIds = (res.tags || []).map((t: any) => t.id)
  form.isTop = res.isTop
  // 显示弹窗
  dialogVisible.value = true
}

// 提交表单（新增或编辑）
const handleSubmit = async () => {
  // 校验标题与内容
  if (!form.title || !form.content) {
    ElMessage.warning('标题和内容不能为空')
    return
  }
  // 根据模式调用不同接口
  if (isEdit.value) {
    // 编辑
    await apiArticleUpdate(editId.value, { ...form })
    ElMessage.success('更新成功')
  } else {
    // 新增
    await apiArticleAdd({ ...form })
    ElMessage.success('发布成功')
  }
  // 关闭弹窗
  dialogVisible.value = false
  // 刷新列表
  loadArticles()
}

// 删除文章
const handleDelete = async (id: number) => {
  // 二次确认
  await ElMessageBox.confirm('确定删除这篇文章吗？', '提示', { type: 'warning' })
  // 调用删除接口
  await apiArticleDel(id)
  // 提示
  ElMessage.success('删除成功')
  // 刷新列表
  loadArticles()
}

// 分页变化
const handlePageChange = (p: number) => {
  // 更新页码
  page.value = p
  // 刷新列表
  loadArticles()
}

// 页面挂载时加载数据
onMounted(() => {
  loadArticles() // 加载列表
  loadOptions() // 加载下拉
})
</script>

<template>
  <!-- 页面整体 -->
  <div>
    <!-- 顶部操作栏 -->
    <div class="toolbar">
      <!-- 标题 -->
      <h2>文章管理</h2>
      <!-- 新增按钮 -->
      <el-button type="primary" @click="openAdd">+ 发布文章</el-button>
    </div>

    <!-- 文章表格 -->
    <el-table :data="articles" border stripe>
      <!-- ID 列 -->
      <el-table-column prop="id" label="ID" width="70" />
      <!-- 标题列 -->
      <el-table-column prop="title" label="标题" min-width="200" />
      <!-- 分类列 -->
      <el-table-column prop="categoryName" label="分类" width="120" />
      <!-- 浏览量列 -->
      <el-table-column prop="viewCount" label="浏览量" width="90" />
      <!-- 是否置顶列 -->
      <el-table-column label="置顶" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.isTop === 1" type="danger" size="small">置顶</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <!-- 编辑按钮 -->
          <el-button type="primary" size="small" link @click="openEdit(row.id)">编辑</el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" size="small" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      class="pager"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="handlePageChange"
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑文章' : '发布文章'" width="640px">
      <!-- 文章表单 -->
      <el-form :model="form" label-width="70px">
        <!-- 标题 -->
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <!-- 分类 -->
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <!-- 标签（多选） -->
        <el-form-item label="标签">
          <el-select v-model="form.tagIds" multiple placeholder="请选择标签" style="width: 100%">
            <el-option v-for="t in tags" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面">
          <el-input v-model="form.cover" placeholder="封面图片URL(可选)" />
        </el-form-item>
        <!-- 摘要 -->
        <el-form-item label="摘要">
          <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="文章摘要(可选)" />
        </el-form-item>
        <!-- 正文 -->
        <el-form-item label="正文">
          <el-input v-model="form.content" type="textarea" :rows="8" placeholder="请输入正文内容" />
        </el-form-item>
        <!-- 是否置顶 -->
        <el-form-item label="置顶">
          <el-switch v-model="form.isTop" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <!-- 取消 -->
        <el-button @click="dialogVisible = false">取消</el-button>
        <!-- 确定 -->
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 顶部操作栏 */
.toolbar {
  display: flex; /* 横向 */
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 两端对齐 */
  margin-bottom: 16px; /* 下间距 */
}
/* 分页器间距与居中 */
.pager {
  margin-top: 16px; /* 上间距 */
  justify-content: flex-end; /* 右对齐 */
}
</style>
