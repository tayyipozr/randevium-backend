import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { NotificationService } from 'src/notification/notification.service';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './services/notification-processor.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notificationQueue',
    }),
  ],
  providers: [FirebaseService, NotificationService, NotificationProcessor],
  exports: [FirebaseService, BullModule],
  controllers: [FirebaseController],
})
export class FirebaseModule {
  constructor() {}
}
