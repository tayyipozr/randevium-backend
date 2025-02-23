import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './utils/logger/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guard';
import { RolesGuard } from './auth/guard/role.guard';
import { CategoryModule } from './category/category.module';
import { CompanyModule } from './company/company.module';
import { ServiceModule } from './service/service.module';
import { EmployeeModule } from './employee/employee.module';
import { ServiceDetailsModule } from './service-details/service-details.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AppointmentDetailModule } from './appointment-detail/appointment-detail.module';
import { DragonflyModule } from './dragonfly/dragonfly.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { NotificationModule } from './notification/notification.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UploadModule } from './upload/upload.module';
import { CommentModule } from './comment/comment.module';
import { ConstantModule } from './constant/constant.module';
import { BullBoardModule } from './bull-board/bull-board.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullBoardModule,
    AuthModule,
    PrismaModule,
    CategoryModule,
    CompanyModule,
    ServiceModule,
    EmployeeModule,
    ServiceDetailsModule,
    AppointmentModule,
    AppointmentDetailModule,
    DragonflyModule,
    FirebaseModule,
    NotificationModule,
    UploadModule,
    CommentModule,
    ConstantModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AtGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    FirebaseService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
