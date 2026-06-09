// 引入 class-validator 校验装饰器
import { IsNotEmpty, IsOptional, Length, IsEmail } from 'class-validator';

// 用户注册请求体的数据校验类
export class RegisterDto {
  // 用户名必填，长度 3-50
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(3, 50, { message: '用户名长度需在3-50之间' })
  username: string; // 登录账号

  // 密码必填，长度 6-50
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 50, { message: '密码长度需在6-50之间' })
  password: string; // 登录密码（明文，服务端会加密）

  // 昵称可选
  @IsOptional()
  nickname?: string; // 昵称

  // 邮箱可选，但若填写需符合邮箱格式
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string; // 邮箱
}
