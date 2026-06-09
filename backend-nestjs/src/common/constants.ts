// JWT 加密使用的密钥，生产环境应放到环境变量中
export const JWT_SECRET = process.env.JWT_SECRET || 'blog-demo-secret-key';
// JWT 令牌的有效期，这里设置为 7 天（用 any 兼容 jsonwebtoken 的类型定义）
export const JWT_EXPIRES_IN: any = process.env.JWT_EXPIRES_IN || '7d';
