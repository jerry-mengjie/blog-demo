// 引入 Nest 路由相关装饰器
import {
  Controller, // 控制器装饰器
  Get, // GET 路由
  Post, // POST 路由
  Put, // PUT 路由
  Delete, // DELETE 路由
  Param, // 路径参数
  Query, // 查询参数
  Body, // 请求体
  UseGuards, // 使用守卫
} from '@nestjs/common';
// 引入文章服务
import { ArticleService } from './article.service';
// 引入创建文章 DTO
import { CreateArticleDto } from './dto/create-article.dto';
// 引入编辑文章 DTO
import { UpdateArticleDto } from './dto/update-article.dto';
// 引入统一返回工具
import { Result } from '../../common/result';
// 引入公开装饰器
import { Public } from '../../common/public.decorator';
// 引入当前用户装饰器
import { CurrentUser } from '../../common/current-user.decorator';
// 引入管理员守卫
import { AdminGuard } from '../../common/admin.guard';

// 文章模块控制器，统一前缀 /api/article
@Controller('api/article')
export class ArticleController {
  // 注入文章服务
  constructor(private readonly articleService: ArticleService) {}

  // 分页查询文章列表：GET /api/article/list，公开访问
  @Public()
  @Get('list')
  async list(
    @Query('page') page: number, // 页码
    @Query('pageSize') pageSize: number, // 每页条数
    @Query('categoryId') categoryId: number, // 可选分类过滤
  ) {
    // 调用服务并统一返回
    return Result.ok(await this.articleService.list(page, pageSize, categoryId));
  }

  // 置顶文章列表：GET /api/article/top，公开访问（放在 :id 之前避免冲突）
  @Public()
  @Get('top')
  async top() {
    // 返回置顶文章
    return Result.ok(await this.articleService.top());
  }

  // 文章搜索：GET /api/article/search，公开访问
  @Public()
  @Get('search')
  async search(
    @Query('keyword') keyword: string, // 搜索关键词
    @Query('page') page: number, // 页码
    @Query('pageSize') pageSize: number, // 每页条数
  ) {
    // 返回搜索结果
    return Result.ok(await this.articleService.search(keyword, page, pageSize));
  }

  // 文章详情：GET /api/article/detail/:id，公开访问
  @Public()
  @Get('detail/:id')
  async detail(@Param('id') id: number) {
    // 返回文章详情
    return Result.ok(await this.articleService.detail(Number(id)));
  }

  // 发布文章：POST /api/article/add，需管理员
  @UseGuards(AdminGuard)
  @Post('add')
  async add(@CurrentUser('userId') userId: number, @Body() dto: CreateArticleDto) {
    // 以当前用户为作者创建文章
    return Result.ok(await this.articleService.create(userId, dto), '发布成功');
  }

  // 编辑文章：PUT /api/article/update/:id，需管理员
  @UseGuards(AdminGuard)
  @Put('update/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateArticleDto) {
    // 更新指定文章
    return Result.ok(await this.articleService.update(Number(id), dto), '更新成功');
  }

  // 删除文章：DELETE /api/article/del/:id，需管理员
  @UseGuards(AdminGuard)
  @Delete('del/:id')
  async remove(@Param('id') id: number) {
    // 删除指定文章
    return Result.ok(await this.articleService.remove(Number(id)), '删除成功');
  }
}
