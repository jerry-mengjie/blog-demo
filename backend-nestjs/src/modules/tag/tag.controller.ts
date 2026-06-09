// 引入 Nest 路由相关装饰器
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
// 引入标签服务
import { TagService } from './tag.service';
// 引入统一返回工具
import { Result } from '../../common/result';
// 引入公开装饰器
import { Public } from '../../common/public.decorator';
// 引入管理员守卫
import { AdminGuard } from '../../common/admin.guard';

// 标签模块控制器，统一前缀 /api/tag
@Controller('api/tag')
export class TagController {
  // 注入标签服务
  constructor(private readonly tagService: TagService) {}

  // 全部标签：GET /api/tag/list，公开访问
  @Public()
  @Get('list')
  async list() {
    // 返回全部标签
    return Result.ok(await this.tagService.list());
  }

  // 新增标签：POST /api/tag/add，需管理员
  @UseGuards(AdminGuard)
  @Post('add')
  async add(@Body() body: { name: string }) {
    // 调用服务新增标签
    return Result.ok(await this.tagService.add(body.name), '新增成功');
  }
}
