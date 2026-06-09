// 引入 Nest 路由相关装饰器
import { Controller, Post, Get, Put, Body } from '@nestjs/common';
// 引入用户服务
import { UserService } from './user.service';
// 引入注册 DTO
import { RegisterDto } from './dto/register.dto';
// 引入登录 DTO
import { LoginDto } from './dto/login.dto';
// 引入更新资料 DTO
import { UpdateUserDto } from './dto/update-user.dto';
// 引入统一返回工具
import { Result } from '../../common/result';
// 引入公开接口装饰器
import { Public } from '../../common/public.decorator';
// 引入当前用户参数装饰器
import { CurrentUser } from '../../common/current-user.decorator';

// 用户模块控制器，统一前缀 /api/user
@Controller('api/user')
export class UserController {
  // 注入用户服务
  constructor(private readonly userService: UserService) {}

  // 用户注册：POST /api/user/register，公开访问
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // 调用服务完成注册并统一包装返回
    return Result.ok(await this.userService.register(dto), '注册成功');
  }

  // 用户登录：POST /api/user/login，公开访问
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    // 调用服务完成登录并返回 token
    return Result.ok(await this.userService.login(dto), '登录成功');
  }

  // 获取个人信息：GET /api/user/info，需登录
  @Get('info')
  async getInfo(@CurrentUser('userId') userId: number) {
    // 根据当前登录用户ID查询信息
    return Result.ok(await this.userService.getInfo(userId));
  }

  // 修改个人资料：PUT /api/user/info，需登录
  @Put('info')
  async updateInfo(@CurrentUser('userId') userId: number, @Body() dto: UpdateUserDto) {
    // 更新当前登录用户的资料
    return Result.ok(await this.userService.updateInfo(userId, dto), '修改成功');
  }

  // 退出登录：POST /api/user/logout，需登录
  // 采用前端清除 token 的无状态方案，服务端仅返回成功
  @Post('logout')
  async logout() {
    // 直接返回成功（JWT 无状态，由前端删除本地令牌）
    return Result.ok(null, '退出成功');
  }
}
