// 引入 class-validator 校验装饰器
import { IsOptional, IsEmail } from 'class-validator';

// 修改个人资料请求体的数据校验类（所有字段均可选）
export class UpdateUserDto {
  // 昵称可选
  @IsOptional()
  nickname?: string; // 新昵称

  // 头像地址可选
  @IsOptional()
  avatar?: string; // 新头像URL

  // 邮箱可选，填写时需符合邮箱格式
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string; // 新邮箱
}
