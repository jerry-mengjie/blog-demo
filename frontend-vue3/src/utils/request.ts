// 引入 axios 库及其类型
import axios, { type AxiosInstance } from 'axios'
// 引入 Element Plus 的消息提示组件
import { ElMessage } from 'element-plus'
// 引入路由实例，用于登录失效时跳转
import router from '@/router'

// 创建 axios 实例并统一配置
const request: AxiosInstance = axios.create({
  baseURL: '/api', // 统一前缀，配合 vite 代理转发到后端
  timeout: 10000, // 请求超时时间 10 秒
})

// 请求拦截器：每次请求自动携带本地存储的 token
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 读取登录令牌
    const token = localStorage.getItem('token')
    // 若存在 token 则放入请求头 Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 返回处理后的配置
    return config
  },
  // 请求错误直接抛出
  (error) => Promise.reject(error),
)

// 响应拦截器：统一处理后端返回结构与错误
request.interceptors.response.use(
  (response) => {
    // 取出后端统一返回结构 { code, message, data }
    const res = response.data
    // code 为 200 表示成功，直接返回 data
    if (res.code === 200) {
      return res.data
    }
    // 其它业务错误弹出提示
    ElMessage.error(res.message || '请求失败')
    // 抛出错误中断后续 then
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    // 取出 HTTP 状态码
    const status = error.response?.status
    // 401 表示未登录或登录过期
    if (status === 401) {
      // 清除本地令牌与用户信息
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      // 提示用户重新登录
      ElMessage.error('登录已过期，请重新登录')
      // 跳转到首页
      router.push('/')
    } else {
      // 其它错误弹出后端返回的提示信息
      ElMessage.error(error.response?.data?.message || '网络异常')
    }
    // 抛出错误
    return Promise.reject(error)
  },
)

// 由于响应拦截器已把返回值解包为后端的 data，
// 这里用自定义类型覆盖默认的 AxiosResponse 返回类型，方便业务直接拿到数据
interface RequestService {
  get<T = any>(url: string, config?: object): Promise<T> // GET 请求
  post<T = any>(url: string, data?: object, config?: object): Promise<T> // POST 请求
  put<T = any>(url: string, data?: object, config?: object): Promise<T> // PUT 请求
  delete<T = any>(url: string, config?: object): Promise<T> // DELETE 请求
}

// 导出经过类型重写的实例供各 API 模块使用
export default request as unknown as RequestService

