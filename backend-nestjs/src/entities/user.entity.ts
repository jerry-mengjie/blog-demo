// 从 typeorm 引入实体相关的装饰器
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// @Entity 声明这是一个数据库实体，并指定真实表名为 tb_user
@Entity('tb_user')
// 导出用户实体类，对应数据库中的 tb_user 表
export class User {
  // 主键 id，自增长
  @PrimaryGeneratedColumn({ comment: '用户主键ID' })
  id: number; // 用户唯一标识

  // username 列，唯一且非空，最大长度 50
  @Column({ length: 50, unique: true, comment: '登录用户名' })
  username: string; // 用户登录账号

  // password 列，存储加密后的密码，select:false 表示默认查询不返回该字段
  @Column({ length: 255, select: false, comment: '加密后的密码' })
  password: string; // 加密后的登录密码

  // nickname 列，昵称，允许为空
  @Column({ length: 50, nullable: true, comment: '用户昵称' })
  nickname: string; // 展示用的昵称

  // avatar 列，头像地址，允许为空
  @Column({ length: 255, nullable: true, comment: '头像URL' })
  avatar: string; // 用户头像图片地址

  // email 列，邮箱，允许为空
  @Column({ length: 100, nullable: true, comment: '邮箱地址' })
  email: string; // 用户邮箱

  // create_time 列，创建时间，由数据库自动写入
  @CreateDateColumn({ name: 'create_time', comment: '注册时间' })
  createTime: Date; // 账号注册时间

  // status 列，账号状态：1 正常，0 禁用，默认 1
  @Column({ type: 'tinyint', default: 1, comment: '状态:1正常 0禁用' })
  status: number; // 账号是否可用

  // is_admin 列，是否管理员：1 是，0 否，默认 0
  @Column({ name: 'is_admin', type: 'tinyint', default: 0, comment: '是否管理员:1是 0否' })
  isAdmin: number; // 是否拥有后台管理权限
}
