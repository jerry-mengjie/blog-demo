// 引入 Nest 工厂用于创建应用实例
import { NestFactory } from '@nestjs/core';
// 引入全局校验管道
import { ValidationPipe } from '@nestjs/common';
// 引入根模块
import { AppModule } from './app.module';

// 应用启动函数
async function bootstrap() {
  // 创建 Nest 应用实例
  const app = await NestFactory.create(AppModule);
  // 开启跨域，允许前端(默认5173端口)访问
  app.enableCors();
  // 全局启用参数校验管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 只保留 DTO 定义的字段，自动删掉额外参数  检测非白名单字段
      forbidNonWhitelisted: true, // 前端传 DTO 不存在字段 → 直接报错 forbidNonWhitelisted 依赖于 whitelist
      transform: true, // URL/Body 里的字符串自动转成对应类型（如 "18" → 18） 显式指定转化
    }),
  );
  // 监听端口，默认 3000
  await app.listen(process.env.PORT ?? 3000);
  // 控制台打印启动信息
  console.log(`后端服务已启动: http://localhost:${process.env.PORT ?? 3000}`);
}
// 调用启动函数
bootstrap();
