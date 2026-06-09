// 引入模块装饰器
import { Module } from '@nestjs/common';
// 引入 TypeORM 模块
import { TypeOrmModule } from '@nestjs/typeorm';
// 引入标签实体
import { Tag } from '../../entities/tag.entity';
// 引入标签控制器
import { TagController } from './tag.controller';
// 引入标签服务
import { TagService } from './tag.service';

// 声明标签模块
@Module({
  // 注册标签实体仓库
  imports: [TypeOrmModule.forFeature([Tag])],
  // 注册控制器
  controllers: [TagController],
  // 注册服务
  providers: [TagService],
})
export class TagModule {}
