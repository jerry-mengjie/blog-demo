// 引入模块装饰器
import { Module } from '@nestjs/common';
// 引入 TypeORM 模块
import { TypeOrmModule } from '@nestjs/typeorm';
// 引入分类实体
import { Category } from '../../entities/category.entity';
// 引入分类控制器
import { CategoryController } from './category.controller';
// 引入分类服务
import { CategoryService } from './category.service';

// 声明分类模块
@Module({
  // 注册分类实体仓库
  imports: [TypeOrmModule.forFeature([Category])],
  // 注册控制器
  controllers: [CategoryController],
  // 注册服务
  providers: [CategoryService],
})
export class CategoryModule {}
