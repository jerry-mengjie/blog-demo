// 引入守卫接口、上下文与禁止访问异常
import {
  CanActivate, // 守卫接口
  ExecutionContext, // 执行上下文
  Injectable, // 可注入声明
  ForbiddenException, // 禁止访问异常
} from '@nestjs/common';

// 管理员守卫：要求当前登录用户必须是管理员
@Injectable()
export class AdminGuard implements CanActivate {
  // 判断是否放行
  canActivate(context: ExecutionContext): boolean {
    // 取出请求对象
    const request = context.switchToHttp().getRequest();
    // 取出 JwtAuthGuard 解析挂载的用户信息
    const user = request.user;
    // 若不是管理员则抛出 403 异常
    if (!user || Number(user.isAdmin) !== 1) {
      throw new ForbiddenException('无管理员权限');
    }
    // 是管理员则放行
    return true;
  }
}
