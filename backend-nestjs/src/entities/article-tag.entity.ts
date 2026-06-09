// 引入 typeorm 实体装饰器
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// 声明文章-标签中间实体，对应数据库表 tb_article_tag（多对多关系）
@Entity('tb_article_tag')
// 导出文章标签关联实体类
export class ArticleTag {
  // 主键 id，自增长
  @PrimaryGeneratedColumn({ comment: '关联主键ID' })
  id: number; // 关联记录唯一标识

  // article_id 列，关联的文章ID
  @Column({ name: 'article_id', comment: '文章ID' })
  articleId: number; // 关联的文章

  // tag_id 列，关联的标签ID
  @Column({ name: 'tag_id', comment: '标签ID' })
  tagId: number; // 关联的标签
}
