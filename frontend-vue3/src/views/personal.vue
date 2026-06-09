<script setup lang="ts">
// 引入响应式与生命周期
import { ref, reactive, onMounted } from 'vue'
// 引入路由跳转
import { useRouter } from 'vue-router'
// 引入用户仓库
import { useUserStore } from '@/stores/user'
// 引入用户信息接口
import { apiGetUserInfo, apiUpdateUserInfo } from '@/api/user'
// 引入收藏接口
import { apiFavoriteList } from '@/api/favorite'
// 引入消息提示
import { ElMessage } from 'element-plus'

// 路由实例
const router = useRouter()
// 用户仓库
const userStore = useUserStore()

// 当前激活的标签页
const activeTab = ref('info')
// 个人资料表单
const form = reactive({
  nickname: '', // 昵称
  avatar: '', // 头像
  email: '', // 邮箱
})
// 我的收藏列表
const favorites = ref<any[]>([])

// 加载个人信息
const loadInfo = async () => {
  // 调用接口获取最新信息
  const res: any = await apiGetUserInfo()
  // 填充表单
  form.nickname = res.nickname || ''
  form.avatar = res.avatar || ''
  form.email = res.email || ''
}

// 保存个人资料
const saveInfo = async () => {
  // 调用更新接口
  await apiUpdateUserInfo({ nickname: form.nickname, avatar: form.avatar, email: form.email })
  // 刷新仓库中的用户信息
  await userStore.fetchUserInfo()
  // 提示成功
  ElMessage.success('资料修改成功')
}

// 加载我的收藏
const loadFavorites = async () => {
  // 调用收藏列表接口
  favorites.value = await apiFavoriteList()
}

// 跳转到文章详情
const goDetail = (id: number) => router.push(`/article/${id}`)

// 页面挂载时校验登录并加载数据
onMounted(() => {
  // 未登录则跳回首页
  if (!userStore.isLogin) {
    ElMessage.warning('请先登录')
    router.push('/')
    return
  }
  // 加载个人信息
  loadInfo()
  // 加载收藏列表
  loadFavorites()
})
</script>

<template>
  <!-- 页面容器 -->
  <div class="page-container">
    <!-- 标签页：个人资料 / 我的收藏 -->
    <el-tabs v-model="activeTab" class="tabs">
      <!-- 个人资料标签页 -->
      <el-tab-pane label="个人资料" name="info">
        <el-card class="info-card">
          <!-- 资料表单 -->
          <el-form :model="form" label-width="80px" style="max-width: 480px">
            <!-- 用户名（只读） -->
            <el-form-item label="用户名">
              <el-input :model-value="userStore.userInfo?.username" disabled />
            </el-form-item>
            <!-- 昵称 -->
            <el-form-item label="昵称">
              <el-input v-model="form.nickname" placeholder="请输入昵称" />
            </el-form-item>
            <!-- 头像地址 -->
            <el-form-item label="头像">
              <el-input v-model="form.avatar" placeholder="请输入头像图片URL" />
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="邮箱">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
            <!-- 保存按钮 -->
            <el-form-item>
              <el-button type="primary" @click="saveInfo">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- 我的收藏标签页 -->
      <el-tab-pane label="我的收藏" name="favorite">
        <!-- 收藏为空 -->
        <el-empty v-if="favorites.length === 0" description="还没有收藏任何文章" />
        <!-- 收藏列表 -->
        <el-card
          v-for="f in favorites"
          :key="f.id"
          class="fav-item"
          shadow="hover"
          @click="f.article && goDetail(f.article.id)"
        >
          <!-- 文章标题 -->
          <h3 v-if="f.article">{{ f.article.title }}</h3>
          <!-- 文章已删除提示 -->
          <h3 v-else class="deleted">该文章已被删除</h3>
          <!-- 收藏时间 -->
          <div class="fav-time">收藏于 {{ new Date(f.createTime).toLocaleString() }}</div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
/* 标签页上间距 */
.tabs {
  background: #fff; /* 白底 */
  padding: 20px; /* 内边距 */
  border-radius: 8px; /* 圆角 */
}
/* 收藏项 */
.fav-item {
  margin-bottom: 12px; /* 下间距 */
  cursor: pointer; /* 手型 */
}
/* 收藏时间 */
.fav-time {
  color: #c0c4cc; /* 浅灰 */
  font-size: 13px; /* 字号 */
  margin-top: 6px; /* 上间距 */
}
/* 已删除文章标题 */
.deleted {
  color: #c0c4cc; /* 灰色 */
}
</style>
