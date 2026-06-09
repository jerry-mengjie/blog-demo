// 引入 Nest 路由相关装饰器
import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
// 引入评论服务
import { CommentService } from './comment.service';
// 引入创建评论 DTO
import { CreateCommentDto } from './dto/create-comment.dto';
// 引入统一返回工具
import { Result } from '../../common/result';
// 引入公开装饰器
import { Public } from '../../common/public.decorator';
// 引入当前用户装饰器
import { CurrentUser } from '../../common/current-user.decorator';

// 评论模块控制器，统一前缀 /api/comment
@Controller('api/comment')
export class CommentController {
  // 注入评论服务
  constructor(private readonly commentService: CommentService) {}

  // 文章评论列表：GET /api/comment/list/:articleId，公开访问
  @Public()
  @Get('list/:articleId')
  async list(@Param('articleId') articleId: number) {
    // 返回该文章的评论树
    return Result.ok(await this.commentService.listByArticle(Number(articleId)));
  }

  // 发表评论：POST /api/comment/add，需登录
  @Post('add')
  async add(@CurrentUser('userId') userId: number, @Body() dto: CreateCommentDto) {
    // 以当前用户身份发表评论
    return Result.ok(await this.commentService.add(userId, dto), '评论成功');
  }

  // 删除评论：DELETE /api/comment/del/:id，需登录（本人或管理员）
  @Delete('del/:id')
  async remove(
    @Param('id') id: number, // 评论ID
    @CurrentUser('userId') userId: number, // 当前用户ID
    @CurrentUser('isAdmin') isAdmin: number, // 是否管理员
  ) {
    // 删除评论
    return Result.ok(await this.commentService.remove(Number(id), userId, isAdmin), '删除成功');
  }
}
