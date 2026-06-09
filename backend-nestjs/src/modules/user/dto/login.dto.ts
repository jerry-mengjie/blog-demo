// 引入 class-validator 校验装饰器
import { IsNotEmpty } from 'class-validator';

// 用户登录请求体的数据校验类
export class LoginDto {
  // 用户名必填
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string; // 登录账号

  // 密码必填
  @IsNotEmpty({ message: '密码不能为空' })
  password: string; // 登录密码
}
