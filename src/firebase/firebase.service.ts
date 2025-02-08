import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  onModuleInit() {
    // Check if Firebase is already initialized
    if (!admin.apps.length) {
      const serviceAccountPath = path.join(
        process.cwd(),
        'firebase',
        'randevium-test-firebase.json',
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
    }
  }

  async sendNotification(token: string, title: string, body: string) {
    try {
      const message = {
        notification: { title, body },
        token,
      };

      const response = await admin.messaging().send(message);

      const user = await this.prisma.user.findFirst({
        where: {
          token: token,
        },
      });

      if (!!user) {
        const newNotif = new CreateNotificationDto();
        newNotif.title = title;
        newNotif.message = body;
        newNotif.userId = user.id;

        this.notificationService.create(newNotif);
      }
      console.log('FCM Message Sent:', response);
      return response;
    } catch (error) {
      console.error('Error sending FCM message:', error);
      throw error;
    }
  }

  async sendNotificationToTopic(topic: string, title: string, body: string) {
    try {
      const message = {
        notification: { title, body },
        topic,
      };

      const response = await admin.messaging().send(message);
      console.log('FCM Topic Message Sent:', response);
      return response;
    } catch (error) {
      console.error('Error sending FCM topic message:', error);
      throw error;
    }
  }

  async subscribeToTopic(userId: string, token: string, topic: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user) {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          token: token,
        },
      });
    }

    try {
      await admin.messaging().subscribeToTopic(token, topic);
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      throw error;
    }
    return { message: `Token subscribed to ${topic}` };
  }
}
