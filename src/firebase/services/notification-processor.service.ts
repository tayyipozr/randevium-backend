import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FirebaseService } from 'src/firebase/firebase.service';

@Processor('notificationQueue')
export class NotificationProcessor {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Process()
  async handleNotification(job: Job<{ token: string; message: string }>) {
    const { token, message } = job.data;
    await this.firebaseService.sendNotification(
      token,
      'Randevu Hatırlatma',
      message,
    );
  }
}
