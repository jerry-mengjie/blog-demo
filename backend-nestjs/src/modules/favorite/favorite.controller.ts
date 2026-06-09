// 引入 Nest 路由相关装饰器
import { Controller, Get, Post, Body } from '@nestjs/common';
// 引入收藏服务
import { FavoriteService } from './favorite.service';
// 引入统一返回工具
import { Result } from '../../common/result';
// 引入当前用户装饰器
import { CurrentUser } from '../../common/current-user.decorator';

// 收藏模块控制器，统一前缀 /api/favorite（均需登录）
@Controller('api/favorite')
export class FavoriteController {
  // 注入收藏服务
  constructor(private readonly favoriteService: FavoriteService) {}

  // 收藏 / 取消收藏：POST /api/favorite/add，需登录
  @Post('add')
  async toggle(@CurrentUser('userId') userId: number, @Body() body: { articleId: number }) {
    // 切换收藏状态
    return Result.ok(await this.favoriteService.toggle(userId, body.articleId), '操作成功');
  }

  // 我的收藏列表：GET /api/favorite/list，需登录
  @Get('list')
  async list(@CurrentUser('userId') userId: number) {
    // 返回当前用户的收藏列表
    return Result.ok(await this.favoriteService.myList(userId));
  }
}
