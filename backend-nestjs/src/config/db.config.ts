// 引入全部实体，注册到数据源中
import { User } from '../entities/user.entity'; // 用户实体
import { Article } from '../entities/article.entity'; // 文章实体
import { Category } from '../entities/category.entity'; // 分类实体
import { Tag } from '../entities/tag.entity'; // 标签实体
import { ArticleTag } from '../entities/article-tag.entity'; // 文章标签关联实体
import { Comment } from '../entities/comment.entity'; // 评论实体
import { Favorite } from '../entities/favorite.entity'; // 收藏实体

// MySQL 数据库连接配置（供 TypeOrmModule.forRoot 使用）
export const MYSQL_CONFIG: any = {
  type: 'mysql', // 数据库类型为 MySQL
  host: process.env.MYSQL_HOST || 'localhost', // 数据库主机
  port: Number(process.env.MYSQL_PORT) || 3306, // 数据库端口
  database: process.env.MYSQL_DATABASE || 'blog_demo', // 数据库名
  username: process.env.MYSQL_USER || 'root', // 数据库用户名
  password: process.env.MYSQL_PASSWORD || 'qwqwqw78', // 数据库密码
  charset: 'utf8mb4', // 字符集，支持 emoji
  timezone: '+08:00', // 时区设置为东八区
  entities: [User, Article, Category, Tag, ArticleTag, Comment, Favorite], // 注册的实体列表
  synchronize: true, // 自动根据实体同步表结构（开发环境使用）
};
