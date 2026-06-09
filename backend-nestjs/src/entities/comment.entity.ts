// 引入 typeorm 实体装饰器
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// 声明评论实体，对应数据库表 tb_comment
@Entity('tb_comment')
// 导出评论实体类
export class Comment {
  // 主键 id，自增长
  @PrimaryGeneratedColumn({ comment: '评论主键ID' })
  id: number; // 评论唯一标识

  // article_id 列，所属文章ID
  @Column({ name: 'article_id', comment: '所属文章ID' })
  articleId: number; // 评论所属的文章

  // user_id 列，评论人用户ID
  @Column({ name: 'user_id', comment: '评论人用户ID' })
  userId: number; // 发表评论的用户

  // parent_id 列，父评论ID，0 表示一级评论
  @Column({ name: 'parent_id', default: 0, comment: '父评论ID,0为顶级' })
  parentId: number; // 用于实现评论的回复结构

  // content 列，评论内容
  @Column({ type: 'text', comment: '评论内容' })
  content: string; // 评论文字内容

  // create_time 列，创建时间，自动写入
  @CreateDateColumn({ name: 'create_time', comment: '评论时间' })
  createTime: Date; // 评论发表时间

  // status 列，评论状态：1 正常 0 隐藏，默认 1
  @Column({ type: 'tinyint', default: 1, comment: '状态:1正常 0隐藏' })
  status: number; // 评论是否展示
}
