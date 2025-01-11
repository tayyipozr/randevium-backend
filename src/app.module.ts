import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './utils/logger/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guard';
import { RolesGuard } from './auth/guard/role.guard';
import { CategoryModule } from './category/category.module';
import { AppLogger, LoggerModule } from './utils';
import { CompanyModule } from './company/company.module';
import { ServiceModule } from './service/service.module';
import { EmployeeModule } from './employee/employee.module';
import { ServiceDetailsModule } from './service-details/service-details.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule, PrismaModule, CategoryModule, CompanyModule, ServiceModule, EmployeeModule, ServiceDetailsModule],
  providers: [{ provide: APP_GUARD, useClass: AtGuard }, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
