// 引入模块装饰器
import { Module } from '@nestjs/common';
// 引入 TypeORM 根模块
import { TypeOrmModule } from '@nestjs/typeorm';
// 引入 JWT 模块（设为全局，供守卫与服务共用）
import { JwtModule } from '@nestjs/jwt';
// 引入用于注册全局守卫的令牌
import { APP_GUARD } from '@nestjs/core';
// 引入数据库配置
import { MYSQL_CONFIG } from './config/db.config';
// 引入 JWT 密钥与有效期常量
import { JWT_SECRET, JWT_EXPIRES_IN } from './common/constants';
// 引入全局 JWT 守卫
import { JwtAuthGuard } from './common/jwt-auth.guard';
// 引入各业务模块
import { UserModule } from './modules/user/user.module'; // 用户模块
import { ArticleModule } from './modules/article/article.module'; // 文章模块
import { CategoryModule } from './modules/category/category.module'; // 分类模块
import { TagModule } from './modules/tag/tag.module'; // 标签模块
import { CommentModule } from './modules/comment/comment.module'; // 评论模块
import { FavoriteModule } from './modules/favorite/favorite.module'; // 收藏模块

// 应用根模块
@Module({
  // 导入的子模块集合
  imports: [
    // 连接 MySQL 数据库
    TypeOrmModule.forRoot(MYSQL_CONFIG),
    // 全局注册 JWT 模块，令牌签发与校验统一配置
    JwtModule.register({
      global: true, // 设为全局模块，无需在各模块重复导入
      secret: JWT_SECRET, // 签名密钥
      signOptions: { expiresIn: JWT_EXPIRES_IN }, // 默认有效期
    }),
    // 各业务模块
    UserModule, // 用户
    ArticleModule, // 文章
    CategoryModule, // 分类
    TagModule, // 标签
    CommentModule, // 评论
    FavoriteModule, // 收藏
  ],
  // 全局提供者
  providers: [
    // 注册全局 JWT 守卫：除标记 @Public() 外所有接口均需登录
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
