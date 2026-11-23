import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest<Request>();

    console.log('Request started:', request.url);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`Request completed in ${duration}ms`);
      }),
    );
  }
}
