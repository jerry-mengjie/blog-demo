<script setup lang="ts">
// 引入路由跳转
import { useRouter } from 'vue-router'
// 引入用户仓库
import { useUserStore } from '@/stores/user'
// 引入消息提示
import { ElMessage } from 'element-plus'

// 路由实例
const router = useRouter()
// 用户仓库
const userStore = useUserStore()

// 退出后台登录
const handleLogout = async () => {
  // 调用退出方法
  await userStore.logout()
  // 提示
  ElMessage.success('已退出')
  // 跳转到后台登录页
  router.push('/admin/login')
}
</script>

<template>
  <!-- 后台整体容器 -->
  <div class="admin-wrap">
    <!-- 左侧菜单栏 -->
    <aside class="sidebar">
      <!-- 后台标题 -->
      <div class="admin-logo">博客后台</div>
      <!-- 菜单：使用 element 菜单组件，按当前路由高亮 -->
      <el-menu :default-active="$route.path" router class="admin-menu">
        <!-- 文章管理菜单 -->
        <el-menu-item index="/admin/article">文章管理</el-menu-item>
        <!-- 分类标签管理菜单 -->
        <el-menu-item index="/admin/category-tag">分类标签管理</el-menu-item>
      </el-menu>
    </aside>

    <!-- 右侧内容区 -->
    <section class="content">
      <!-- 顶部条 -->
      <header class="topbar">
        <!-- 返回前台链接 -->
        <span class="back" @click="router.push('/')">← 返回前台</span>
        <!-- 当前管理员与退出 -->
        <div>
          <span class="admin-name">
            {{ userStore.userInfo?.nickname || userStore.userInfo?.username }}
          </span>
          <el-button type="danger" size="small" link @click="handleLogout">退出</el-button>
        </div>
      </header>
      <!-- 子路由内容出口 -->
      <div class="page-body">
        <router-view />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 后台整体左右布局 */
.admin-wrap {
  display: flex; /* 弹性布局 */
  min-height: 100vh; /* 撑满视口高度 */
}
/* 左侧菜单栏 */
.sidebar {
  width: 200px; /* 固定宽度 */
  background: #001529; /* 深色背景 */
}
/* 后台 Logo */
.admin-logo {
  height: 60px; /* 高度 */
  line-height: 60px; /* 垂直居中 */
  text-align: center; /* 水平居中 */
  color: #fff; /* 白色文字 */
  font-size: 18px; /* 字号 */
  font-weight: bold; /* 加粗 */
}
/* 菜单去除右边框 */
.admin-menu {
  border-right: none; /* 无右边框 */
  background: transparent; /* 透明背景 */
}
/* 右侧内容区 */
.content {
  flex: 1; /* 占满剩余宽度 */
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 纵向排列 */
}
/* 顶部条 */
.topbar {
  height: 60px; /* 高度 */
  background: #fff; /* 白色背景 */
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 两端对齐 */
  padding: 0 20px; /* 内边距 */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08); /* 阴影 */
}
/* 返回链接 */
.back {
  cursor: pointer; /* 手型 */
  color: #409eff; /* 主题色 */
}
/* 管理员名称 */
.admin-name {
  margin-right: 12px; /* 右间距 */
  color: #606266; /* 灰色文字 */
}
/* 内容主体 */
.page-body {
  flex: 1; /* 占满剩余高度 */
  padding: 20px; /* 内边距 */
}
</style>
