// 引入 typeorm 实体装饰器
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// 声明收藏实体，对应数据库表 tb_favorite
@Entity('tb_favorite')
// 导出收藏实体类
export class Favorite {
  // 主键 id，自增长
  @PrimaryGeneratedColumn({ comment: '收藏主键ID' })
  id: number; // 收藏记录唯一标识

  // user_id 列，收藏人用户ID
  @Column({ name: 'user_id', comment: '收藏人用户ID' })
  userId: number; // 进行收藏的用户

  // article_id 列，被收藏的文章ID
  @Column({ name: 'article_id', comment: '被收藏文章ID' })
  articleId: number; // 被收藏的文章

  // create_time 列，收藏时间，自动写入
  @CreateDateColumn({ name: 'create_time', comment: '收藏时间' })
  createTime: Date; // 收藏发生的时间
}
