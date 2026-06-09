// 引入模块装饰器
import { Module } from '@nestjs/common';
// 引入 TypeORM 模块
import { TypeOrmModule } from '@nestjs/typeorm';
// 引入评论实体
import { Comment } from '../../entities/comment.entity';
// 引入用户实体
import { User } from '../../entities/user.entity';
// 引入评论控制器
import { CommentController } from './comment.controller';
// 引入评论服务
import { CommentService } from './comment.service';

// 声明评论模块
@Module({
  // 注册评论与用户实体仓库
  imports: [TypeOrmModule.forFeature([Comment, User])],
  // 注册控制器
  controllers: [CommentController],
  // 注册服务
  providers: [CommentService],
})
export class CommentModule {}
