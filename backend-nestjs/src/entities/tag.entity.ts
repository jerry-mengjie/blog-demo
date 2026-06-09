// 引入 typeorm 实体装饰器
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// 声明标签实体，对应数据库表 tb_tag
@Entity('tb_tag')
// 导出标签实体类
export class Tag {
  // 主键 id，自增长
  @PrimaryGeneratedColumn({ comment: '标签主键ID' })
  id: number; // 标签唯一标识

  // name 列，标签名称，唯一
  @Column({ length: 50, unique: true, comment: '标签名称' })
  name: string; // 标签名称
}
