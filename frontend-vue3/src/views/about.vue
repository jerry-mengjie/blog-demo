<script setup lang="ts">
// 关于页为纯静态展示，无需逻辑
</script>

<template>
  <!-- 页面容器 -->
  <div class="page-container">
    <!-- 关于卡片 -->
    <el-card class="about-card">
      <!-- 标题 -->
      <h1>关于本站</h1>
      <!-- 介绍段落 -->
      <p>
        这是一个基于 <strong>Vue3 + NestJS + MySQL</strong> 构建的通用博客系统最简版示例项目。
      </p>
      <!-- 功能列表标题 -->
      <h3>主要功能</h3>
      <!-- 功能列表 -->
      <ul>
        <li>文章发布、编辑、删除与分类标签管理</li>
        <li>文章列表分页、搜索与置顶展示</li>
        <li>用户注册登录、个人资料修改</li>
        <li>文章评论与收藏</li>
        <li>后台管理（文章 / 分类 / 标签）</li>
      </ul>
      <!-- 技术栈标题 -->
      <h3>技术栈</h3>
      <!-- 技术栈列表 -->
      <ul>
        <li>前端：Vue3 + TypeScript + Element Plus + Pinia + Vue Router</li>
        <li>后端：NestJS + TypeORM + JWT</li>
        <li>数据库：MySQL</li>
      </ul>
    </el-card>
  </div>
</template>

<style scoped>
/* 关于卡片内边距 */
.about-card {
  padding: 10px; /* 内边距 */
  line-height: 2; /* 行高 */
}
/* 二级标题间距 */
.about-card h3 {
  margin-top: 20px; /* 上间距 */
  color: #409eff; /* 主题色 */
}
/* 列表缩进 */
.about-card ul {
  padding-left: 22px; /* 左缩进 */
}
</style>
