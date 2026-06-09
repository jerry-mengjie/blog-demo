// 引入模块装饰器
import { Module } from '@nestjs/common';
// 引入 TypeORM 模块
import { TypeOrmModule } from '@nestjs/typeorm';
// 引入文章相关实体
import { Article } from '../../entities/article.entity';
// 引入文章标签关联实体
import { ArticleTag } from '../../entities/article-tag.entity';
// 引入标签实体
import { Tag } from '../../entities/tag.entity';
// 引入分类实体
import { Category } from '../../entities/category.entity';
// 引入用户实体
import { User } from '../../entities/user.entity';
// 引入文章控制器
import { ArticleController } from './article.controller';
// 引入文章服务
import { ArticleService } from './article.service';

// 声明文章模块
@Module({
  // 注册文章模块需要用到的实体仓库
  imports: [TypeOrmModule.forFeature([Article, ArticleTag, Tag, Category, User])],
  // 注册控制器
  controllers: [ArticleController],
  // 注册服务
  providers: [ArticleService],
})
export class ArticleModule {}
