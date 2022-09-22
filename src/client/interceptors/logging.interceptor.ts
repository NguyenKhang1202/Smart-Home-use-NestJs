import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    res.on('finish', () => {
      const statusCode = res.statusCode;
      Logger.debug(
        `${context.getClass().name}.${context.getHandler().name}() : ${
          req.method
        } ${req.url} ${statusCode}`,
        'LoggingInterceptor',
      );
    });
    return next.handle();
  }
}
