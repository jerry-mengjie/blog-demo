// 引入模块装饰器
import { Module } from '@nestjs/common';
// 引入 TypeORM 模块
import { TypeOrmModule } from '@nestjs/typeorm';
// 引入收藏实体
import { Favorite } from '../../entities/favorite.entity';
// 引入文章实体
import { Article } from '../../entities/article.entity';
// 引入收藏控制器
import { FavoriteController } from './favorite.controller';
// 引入收藏服务
import { FavoriteService } from './favorite.service';

// 声明收藏模块
@Module({
  // 注册收藏与文章实体仓库
  imports: [TypeOrmModule.forFeature([Favorite, Article])],
  // 注册控制器
  controllers: [FavoriteController],
  // 注册服务
  providers: [FavoriteService],
})
export class FavoriteModule {}
