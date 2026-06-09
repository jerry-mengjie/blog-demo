// 引入模块装饰器
import { Module } from '@nestjs/common';
// 引入 TypeORM 模块用于注册实体仓库
import { TypeOrmModule } from '@nestjs/typeorm';
// 引入用户实体
import { User } from '../../entities/user.entity';
// 引入用户控制器
import { UserController } from './user.controller';
// 引入用户服务
import { UserService } from './user.service';

// 声明用户模块
@Module({
  // 注册 User 实体仓库供本模块注入
  imports: [TypeOrmModule.forFeature([User])],
  // 注册控制器
  controllers: [UserController],
  // 注册服务
  providers: [UserService],
})
export class UserModule {}
