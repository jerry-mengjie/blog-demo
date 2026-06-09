// 从 typeorm 引入实体相关的装饰器
import {
  Entity, // 实体声明装饰器
  PrimaryGeneratedColumn, // 自增主键装饰器
  Column, // 普通列装饰器
  CreateDateColumn, // 创建时间列装饰器
  UpdateDateColumn, // 更新时间列装饰器
} from 'typeorm';

// 声明文章实体，对应数据库表 tb_article
@Entity('tb_article')
// 导出文章实体类
export class Article {
  // 主键 id，自增长
  @PrimaryGeneratedColumn({ comment: '文章主键ID' })
  id: number; // 文章唯一标识

  // user_id 列，作者用户ID
  @Column({ name: 'user_id', comment: '作者用户ID' })
  userId: number; // 文章所属作者的用户ID

  // title 列，文章标题，非空
  @Column({ length: 200, comment: '文章标题' })
  title: string; // 文章标题

  // cover 列，封面图地址，允许为空
  @Column({ length: 255, nullable: true, comment: '封面图URL' })
  cover: string; // 文章封面图片

  // content 列，正文内容，使用 text 类型存储长文本
  @Column({ type: 'text', comment: '文章正文内容' })
  content: string; // 文章正文

  // summary 列，文章摘要，允许为空
  @Column({ length: 500, nullable: true, comment: '文章摘要' })
  summary: string; // 文章简短摘要

  // category_id 列，所属分类ID，允许为空
  @Column({ name: 'category_id', nullable: true, comment: '所属分类ID' })
  categoryId: number; // 文章所属分类

  // view_count 列，浏览量，默认 0
  @Column({ name: 'view_count', default: 0, comment: '浏览量' })
  viewCount: number; // 文章被浏览的次数

  // is_top 列，是否置顶：1 置顶 0 普通，默认 0
  @Column({ name: 'is_top', type: 'tinyint', default: 0, comment: '是否置顶:1是 0否' })
  isTop: number; // 是否在列表中置顶

  // create_time 列，创建时间，自动写入
  @CreateDateColumn({ name: 'create_time', comment: '发布时间' })
  createTime: Date; // 文章发布时间

  // update_time 列，更新时间，自动维护
  @UpdateDateColumn({ name: 'update_time', comment: '最后更新时间' })
  updateTime: Date; // 文章最后修改时间

  // status 列，文章状态：1 已发布 0 草稿/下架，默认 1
  @Column({ type: 'tinyint', default: 1, comment: '状态:1发布 0下架' })
  status: number; // 文章发布状态
}
