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
      whitelist: true, // 自动过滤掉 DTO 中未声明的字段
      transform: true, // 自动把入参转换为 DTO 类型
    }),
  );
  // 监听端口，默认 3000
  await app.listen(process.env.PORT ?? 3000);
  // 控制台打印启动信息
  console.log(`后端服务已启动: http://localhost:${process.env.PORT ?? 3000}`);
}
// 调用启动函数
bootstrap();
