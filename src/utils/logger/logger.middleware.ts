import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;

      const contentLenght = response.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLenght} - ${userAgent} - ${ip}`
      );

      if (method !== 'GET')
        this.logger.log(request.body);

    });
    next();
  }
} 