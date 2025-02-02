import { Controller, Post, Body, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { Public } from 'src/auth/decorator';

@Public()
@Controller('firebase')
export class FirebaseController {
    constructor(private readonly firebaseService: FirebaseService) { }

    @Post('send-notification')
    async sendNotification(@Body() body: { token: string; title: string; message: string }) {
        return this.firebaseService.sendNotification(body.token, body.title, body.message);
    }

    @Post('send-topic')
    async sendNotificationToTopic(@Body() body: { topic: string; title: string; message: string }) {
        return this.firebaseService.sendNotificationToTopic(body.topic, body.title, body.message);
    }

    @Post('subscribe-topic')
    async subscribeToTopic(@Body() body: { token: string; topic: string }) {
        return this.firebaseService.subscribeToTopic(body.token, body.topic);
    }
}
