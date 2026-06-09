// 引入 vue-router 的创建函数
import { createRouter, createWebHistory } from 'vue-router'

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 history 模式
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由表
  routes: [
    // 前台用户端：使用前台布局，包含 5 个页面
    {
      path: '/', // 根路径
      component: () => import('@/layouts/FrontLayout.vue'), // 前台布局
      children: [
        // 首页（文章聚合、分类导航、热门文章）
        { path: '', name: 'index', component: () => import('@/views/index.vue') },
        // 文章详情页（正文 + 评论区）
        { path: 'article/:id', name: 'article-detail', component: () => import('@/views/article-detail.vue') },
        // 文章搜索页
        { path: 'search', name: 'search', component: () => import('@/views/search.vue') },
        // 个人中心（信息修改 + 我的收藏）
        { path: 'personal', name: 'personal', component: () => import('@/views/personal.vue') },
        // 关于本站
        { path: 'about', name: 'about', component: () => import('@/views/about.vue') },
      ],
    },
    // 后台管理端：管理员登录页（独立页面，不套后台布局）
    { path: '/admin/login', name: 'admin-login', component: () => import('@/views/admin/admin-login.vue') },
    // 后台管理端：使用后台布局，包含文章管理与分类标签管理
    {
      path: '/admin', // 后台根路径
      component: () => import('@/layouts/AdminLayout.vue'), // 后台布局
      meta: { requiresAdmin: true }, // 标记需要管理员权限
      children: [
        // 默认跳转到文章管理
        { path: '', redirect: '/admin/article' },
        // 文章管理（新增 / 编辑 / 删除）
        { path: 'article', name: 'admin-article', component: () => import('@/views/admin/admin-article.vue') },
        // 分类标签管理
        { path: 'category-tag', name: 'admin-category-tag', component: () => import('@/views/admin/admin-category-tag.vue') },
      ],
    },
  ],
})

// 全局前置守卫：拦截需要管理员权限的后台路由
router.beforeEach((to, _from, next) => {
  // 判断目标路由是否需要管理员
  if (to.meta.requiresAdmin) {
    // 读取本地存储的用户信息
    const userStr = localStorage.getItem('userInfo')
    // 解析用户信息
    const user = userStr ? JSON.parse(userStr) : null
    // 非管理员则跳转到后台登录页
    if (!user || user.isAdmin !== 1) {
      return next('/admin/login')
    }
  }
  // 其它情况正常放行
  next()
})

// 导出路由实例
export default router
