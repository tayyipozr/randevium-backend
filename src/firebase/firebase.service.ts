import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
    constructor() { }

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

    async subscribeToTopic(token: string, topic: string) {
        try {
            await admin.messaging().subscribeToTopic(token, topic);
            return { message: `Token subscribed to ${topic}` };
        } catch (error) {
            console.error('Error subscribing to topic:', error);
            throw error;
        }
    }
}
