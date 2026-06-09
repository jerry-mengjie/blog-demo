// 引入守卫所需的接口与异常类
import {
  CanActivate, // 守卫需要实现的接口
  ExecutionContext, // 执行上下文类型
  Injectable, // 声明可注入
  UnauthorizedException, // 未授权异常
} from '@nestjs/common';
// 引入 Reflector 用于读取路由上的元数据
import { Reflector } from '@nestjs/core';
// 引入 JWT 服务用于校验令牌
import { JwtService } from '@nestjs/jwt';
// 引入 @Public() 装饰器所用的元数据键
import { IS_PUBLIC_KEY } from './public.decorator';
// 引入 JWT 密钥常量
import { JWT_SECRET } from './constants';

// 声明这是一个可注入的全局 JWT 守卫
@Injectable()
export class JwtAuthGuard implements CanActivate {
  // 通过构造函数注入 Reflector 与 JwtService
  constructor(
    private readonly reflector: Reflector, // 用于读取元数据
    private readonly jwtService: JwtService, // 用于验证令牌
  ) {}

  // canActivate 返回 true 放行，false 或抛异常则拦截
  canActivate(context: ExecutionContext): boolean {
    // 读取方法或类上是否标记了 @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // 当前处理方法
      context.getClass(), // 当前控制器类
    ]);
    // 如果是公开接口则直接放行
    if (isPublic) return true;
    // 取出 HTTP 请求对象
    const request = context.switchToHttp().getRequest();
    // 从请求头 authorization 中提取 Bearer 令牌
    const authHeader: string = request.headers['authorization'] || '';
    // 按空格拆分，取出实际的 token 部分
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    // 没有 token 直接抛出未授权异常
    if (!token) throw new UnauthorizedException('未登录或登录已过期');
    // 尝试验证并解析 token
    try {
      // 校验签名并解码出载荷
      const payload = this.jwtService.verify(token, { secret: JWT_SECRET });
      // 将解析出的用户信息挂载到 request 上供后续使用
      request.user = payload;
      // 校验通过，放行
      return true;
    } catch {
      // token 无效或过期，抛出未授权异常
      throw new UnauthorizedException('登录状态无效，请重新登录');
    }
  }
}
