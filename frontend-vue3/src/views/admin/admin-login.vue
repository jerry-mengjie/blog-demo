<script setup lang="ts">
// 引入响应式
import { reactive } from 'vue'
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

// 登录表单
const form = reactive({
  username: '', // 用户名
  password: '', // 密码
})

// 处理登录
const handleLogin = async () => {
  // 校验非空
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  // 调用仓库登录
  await userStore.login(form.username, form.password)
  // 校验是否为管理员
  if (!userStore.isAdmin) {
    // 非管理员则退出并提示
    await userStore.logout()
    ElMessage.error('该账号无管理员权限')
    return
  }
  // 提示成功
  ElMessage.success('登录成功')
  // 跳转到后台
  router.push('/admin')
}
</script>

<template>
  <!-- 登录页整体容器（居中） -->
  <div class="login-wrap">
    <!-- 登录卡片 -->
    <el-card class="login-card">
      <!-- 标题 -->
      <h2 class="login-title">博客后台管理</h2>
      <!-- 登录表单 -->
      <el-form :model="form" label-width="0">
        <!-- 用户名输入 -->
        <el-form-item>
          <el-input v-model="form.username" placeholder="管理员账号" size="large" />
        </el-form-item>
        <!-- 密码输入，回车登录 -->
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button type="primary" size="large" style="width: 100%" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 默认账号提示 -->
      <p class="tip">默认账号：admin / admin123</p>
    </el-card>
  </div>
</template>

<style scoped>
/* 登录页背景与居中 */
.login-wrap {
  height: 100vh; /* 满屏高度 */
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  background: linear-gradient(135deg, #409eff, #2c3e50); /* 渐变背景 */
}
/* 登录卡片 */
.login-card {
  width: 360px; /* 宽度 */
  padding: 10px; /* 内边距 */
}
/* 登录标题 */
.login-title {
  text-align: center; /* 居中 */
  margin-bottom: 24px; /* 下间距 */
  color: #303133; /* 颜色 */
}
/* 提示文字 */
.tip {
  text-align: center; /* 居中 */
  color: #c0c4cc; /* 浅灰 */
  font-size: 13px; /* 字号 */
}
</style>
