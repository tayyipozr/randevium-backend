import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter, PrismaExceptionFilter } from './utils';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
  });

  (global as any).expressApp = server;

  app.setGlobalPrefix('/v1/api');
  //Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Randevium')
    .setDescription(
      'API documentation for the Randevium Appointment Management System',
    )
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/v1/api/swagger', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new PrismaExceptionFilter(), new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
