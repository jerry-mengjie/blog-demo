// 引入创建参数装饰器的工具和执行上下文类型
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 登录用户在请求中携带的信息结构
export interface JwtPayload {
  userId: number; // 用户ID
  username: string; // 用户名
  isAdmin: number; // 是否管理员
}

// @CurrentUser() 参数装饰器：从请求对象中取出已解析的登录用户信息
export const CurrentUser = createParamDecorator(
  // ctx 为当前执行上下文
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): any => {
    // 切换到 HTTP 上下文并取出 request 对象
    const request = ctx.switchToHttp().getRequest();
    // 守卫会把解析出的用户挂到 request.user 上
    const user: JwtPayload = request.user;
    // 如果指定了字段名则返回对应字段，否则返回整个用户对象
    return data ? user?.[data] : user;
  },
);
