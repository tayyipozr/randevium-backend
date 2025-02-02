import { Controller, Post, Body, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { GetUser, Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enum';

@Controller('firebase')
export class FirebaseController {
    constructor(private readonly firebaseService: FirebaseService) { }

    @Roles(Role.Admin)
    @Post('send-notification')
    sendNotification(@Body() body: { token: string; title: string; message: string }) {
        return this.firebaseService.sendNotification(body.token, body.title, body.message);
    }

    @Roles(Role.Admin)
    @Post('send-topic')
    sendNotificationToTopic(@Body() body: { topic: string; title: string; message: string }) {
        return this.firebaseService.sendNotificationToTopic(body.topic, body.title, body.message);
    }

    @Post('subscribe-topic')
    subscribeToTopic(@GetUser('id') userId: string, @Body() body: { token: string; topic: string }) {
        return this.firebaseService.subscribeToTopic(userId, body.token, body.topic);
    }
}
