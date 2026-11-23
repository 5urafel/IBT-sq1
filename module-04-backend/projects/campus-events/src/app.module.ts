// src/app.module.ts
import { randomUUID } from 'node:crypto';
import { IncomingMessage } from 'node:http';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoggerMiddleware } from './common/logger.middleware.js';
import { EventsModule } from './events/events.module.js';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        // Use incoming x-request-id from your middleware or generate a fallback UUID
        genReqId: (req: IncomingMessage) =>
          (req.headers['x-request-id'] as string) ?? randomUUID(),

        // Never let these reach the output, wherever they appear
        redact: {
          paths: [
            'req.headers.authorization',
            "req.headers['x-api-key']",
            'req.body.password',
            '*.phone',
          ],
          censor: '[redacted]',
        },

        // Human-readable on a laptop, JSON everywhere else
        transport:
          process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                },
              }
            : undefined,
      },
    }),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
