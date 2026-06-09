// 引入 vue 的创建应用函数
import { createApp } from 'vue'
// 引入 pinia 状态管理
import { createPinia } from 'pinia'
// 引入 Element Plus 的全局样式（保证 ElMessage 等程序化组件样式生效）
import 'element-plus/dist/index.css'
// 引入项目全局样式
import '@/assets/main.css'

// 引入根组件
import App from './App.vue'
// 引入路由实例
import router from './router'

// 创建应用实例
const app = createApp(App)

// 注册 pinia
app.use(createPinia())
// 注册路由
app.use(router)

// 挂载到页面 #app 节点
app.mount('#app')
