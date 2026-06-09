<script setup lang="ts">
// 引入响应式与 reactive
import { ref, reactive } from 'vue'
// 引入路由跳转
import { useRouter } from 'vue-router'
// 引入用户状态仓库
import { useUserStore } from '@/stores/user'
// 引入消息提示
import { ElMessage } from 'element-plus'
// 引入注册接口
import { apiRegister } from '@/api/user'

// 路由实例
const router = useRouter()
// 用户仓库实例
const userStore = useUserStore()

// 控制登录/注册弹窗显示
const dialogVisible = ref(false)
// 当前弹窗模式：login 登录 / register 注册
const mode = ref<'login' | 'register'>('login')
// 表单数据
const form = reactive({
  username: '', // 用户名
  password: '', // 密码
  nickname: '', // 昵称（注册用）
  email: '', // 邮箱（注册用）
})

// 打开登录弹窗
const openLogin = () => {
  mode.value = 'login' // 设为登录模式
  dialogVisible.value = true // 显示弹窗
}

// 提交登录或注册
const handleSubmit = async () => {
  // 校验用户名密码非空
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  // 登录模式
  if (mode.value === 'login') {
    // 调用仓库登录方法
    await userStore.login(form.username, form.password)
    // 提示成功
    ElMessage.success('登录成功')
    // 关闭弹窗
    dialogVisible.value = false
  } else {
    // 注册模式：调用注册接口
    await apiRegister({
      username: form.username, // 用户名
      password: form.password, // 密码
      nickname: form.nickname, // 昵称
      email: form.email, // 邮箱
    })
    // 提示注册成功
    ElMessage.success('注册成功，请登录')
    // 切换回登录模式
    mode.value = 'login'
  }
}

// 退出登录
const handleLogout = async () => {
  // 调用仓库退出方法
  await userStore.logout()
  // 提示
  ElMessage.success('已退出登录')
  // 回到首页
  router.push('/')
}
</script>

<template>
  <!-- 顶部导航栏 -->
  <header class="header">
    <div class="header-inner">
      <!-- 站点 Logo，点击回首页 -->
      <div class="logo" @click="router.push('/')">📝 我的博客</div>
      <!-- 导航菜单 -->
      <nav class="nav">
        <!-- 首页链接 -->
        <router-link to="/">首页</router-link>
        <!-- 搜索链接 -->
        <router-link to="/search">搜索</router-link>
        <!-- 关于链接 -->
        <router-link to="/about">关于</router-link>
      </nav>
      <!-- 右侧用户区域 -->
      <div class="user-area">
        <!-- 已登录：显示昵称下拉菜单 -->
        <el-dropdown v-if="userStore.isLogin">
          <span class="user-name">
            {{ userStore.userInfo?.nickname || userStore.userInfo?.username }} ▾
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 进入个人中心 -->
              <el-dropdown-item @click="router.push('/personal')">个人中心</el-dropdown-item>
              <!-- 管理员可进入后台 -->
              <el-dropdown-item v-if="userStore.isAdmin" @click="router.push('/admin')">
                进入后台
              </el-dropdown-item>
              <!-- 退出登录 -->
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- 未登录：显示登录按钮 -->
        <el-button v-else type="primary" size="small" @click="openLogin">登录 / 注册</el-button>
      </div>
    </div>
  </header>

  <!-- 主体内容：子路由出口 -->
  <main class="main">
    <router-view />
  </main>

  <!-- 页脚 -->
  <footer class="footer">© 2026 我的博客 · 基于 Vue3 + NestJS</footer>

  <!-- 登录 / 注册弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="mode === 'login' ? '用户登录' : '用户注册'"
    width="420px"
  >
    <!-- 表单 -->
    <el-form label-width="60px">
      <!-- 用户名 -->
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
      </el-form-item>
      <!-- 注册时显示昵称 -->
      <el-form-item v-if="mode === 'register'" label="昵称">
        <el-input v-model="form.nickname" placeholder="请输入昵称(可选)" />
      </el-form-item>
      <!-- 注册时显示邮箱 -->
      <el-form-item v-if="mode === 'register'" label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱(可选)" />
      </el-form-item>
    </el-form>
    <template #footer>
      <!-- 切换登录/注册模式 -->
      <el-button text @click="mode = mode === 'login' ? 'register' : 'login'">
        {{ mode === 'login' ? '没有账号？去注册' : '已有账号？去登录' }}
      </el-button>
      <!-- 提交按钮 -->
      <el-button type="primary" @click="handleSubmit">
        {{ mode === 'login' ? '登录' : '注册' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
/* 顶部导航固定样式 */
.header {
  background: #fff; /* 白色背景 */
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08); /* 底部阴影 */
  position: sticky; /* 吸顶 */
  top: 0; /* 顶部对齐 */
  z-index: 100; /* 层级置顶 */
}
/* 导航内部容器，居中限宽 */
.header-inner {
  max-width: 1100px; /* 最大宽度 */
  margin: 0 auto; /* 居中 */
  height: 60px; /* 高度 */
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中 */
  padding: 0 20px; /* 左右内边距 */
}
/* Logo 样式 */
.logo {
  font-size: 20px; /* 字号 */
  font-weight: bold; /* 加粗 */
  cursor: pointer; /* 手型 */
  color: #409eff; /* 主题色 */
}
/* 导航菜单 */
.nav {
  display: flex; /* 横向排列 */
  gap: 24px; /* 间距 */
  margin-left: 40px; /* 与 logo 间距 */
  flex: 1; /* 占满剩余空间 */
}
/* 导航链接 */
.nav a {
  color: #606266; /* 默认颜色 */
  font-size: 15px; /* 字号 */
}
/* 当前激活的导航链接 */
.nav a.router-link-exact-active {
  color: #409eff; /* 高亮颜色 */
  font-weight: bold; /* 加粗 */
}
/* 用户昵称样式 */
.user-name {
  cursor: pointer; /* 手型 */
  color: #409eff; /* 主题色 */
  outline: none; /* 去除焦点边框 */
}
/* 主体区域 */
.main {
  min-height: calc(100vh - 120px); /* 最小高度撑满 */
}
/* 页脚样式 */
.footer {
  text-align: center; /* 居中 */
  color: #909399; /* 灰色文字 */
  padding: 20px; /* 内边距 */
  font-size: 13px; /* 字号 */
}
</style>
