// 引入 Nest 路由相关装饰器
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
// 引入分类服务
import { CategoryService } from './category.service';
// 引入统一返回工具
import { Result } from '../../common/result';
// 引入公开装饰器
import { Public } from '../../common/public.decorator';
// 引入管理员守卫
import { AdminGuard } from '../../common/admin.guard';

// 分类模块控制器，统一前缀 /api/category
@Controller('api/category')
export class CategoryController {
  // 注入分类服务
  constructor(private readonly categoryService: CategoryService) {}

  // 全部分类：GET /api/category/list，公开访问
  @Public()
  @Get('list')
  async list() {
    // 返回全部分类
    return Result.ok(await this.categoryService.list());
  }

  // 新增分类：POST /api/category/add，需管理员
  @UseGuards(AdminGuard)
  @Post('add')
  async add(@Body() body: { name: string; sort?: number }) {
    // 调用服务新增分类
    return Result.ok(await this.categoryService.add(body.name, body.sort), '新增成功');
  }
}
