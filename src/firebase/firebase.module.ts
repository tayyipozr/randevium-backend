import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { NotificationService } from 'src/notification/notification.service';

@Global()
@Module({
  providers: [FirebaseService, NotificationService],
  exports: [FirebaseService],
  controllers: [FirebaseController],
})
export class FirebaseModule {
  constructor() {}
}
