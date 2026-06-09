// 引入 typeorm 实体装饰器
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// 声明分类实体，对应数据库表 tb_category
@Entity('tb_category')
// 导出分类实体类
export class Category {
  // 主键 id，自增长
  @PrimaryGeneratedColumn({ comment: '分类主键ID' })
  id: number; // 分类唯一标识

  // name 列，分类名称，唯一
  @Column({ length: 50, unique: true, comment: '分类名称' })
  name: string; // 分类名称

  // sort 列，排序值，越小越靠前，默认 0
  @Column({ default: 0, comment: '排序值,越小越靠前' })
  sort: number; // 分类显示顺序

  // create_time 列，创建时间，自动写入
  @CreateDateColumn({ name: 'create_time', comment: '创建时间' })
  createTime: Date; // 分类创建时间
}
