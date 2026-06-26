// 引入异常过滤器相关类型
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
// 引入 Express 响应类型
import { Response } from 'express';
// 引入统一返回工具
import { Result } from './result';

// 捕获所有 HttpException（含 ValidationPipe、守卫、服务层抛出的异常）
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // 从异常响应中提取可读的错误信息
    let message = exception.message;
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const msg = (exceptionResponse as { message?: string | string[] }).message;
      if (Array.isArray(msg)) {
        message = msg.join('; ');
      } else if (typeof msg === 'string') {
        message = msg;
      }
    }

    // 使用 Result.fail 统一包装错误响应
    response.status(status).json(Result.fail(message, status));
  }
}
