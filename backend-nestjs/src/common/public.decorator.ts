// 引入 SetMetadata 用于给路由附加元数据
import { SetMetadata } from '@nestjs/common';

// 定义元数据的键名，守卫会根据它判断是否放行
export const IS_PUBLIC_KEY = 'isPublic';

// @Public() 装饰器：标记某个接口无需登录即可访问
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
