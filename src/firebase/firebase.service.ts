import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FirebaseService implements OnModuleInit {
    constructor(private readonly prisma: PrismaService) { }

    onModuleInit() {
        // Check if Firebase is already initialized
        if (!admin.apps.length) {
            const serviceAccountPath = path.join(process.cwd(), 'firebase', 'randevium-test-firebase.json');
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
                NOT: {
                    token: token
                }
            }
        });

        if (user) {
            await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    token: token
                }
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
