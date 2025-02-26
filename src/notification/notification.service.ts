import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationModel } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateNotificationDto): Promise<NotificationModel> {
    return this.prisma.notificationModel.create({
      data,
    });
  }

  async findAll(userId: string): Promise<NotificationModel[]> {
    return this.prisma.notificationModel.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        appointment: true,
      },
    });
  }

  async findByUserToken(userId: string): Promise<NotificationModel[]> {
    return this.prisma.notificationModel.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<NotificationModel> {
    return this.prisma.notificationModel.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string): Promise<NotificationModel> {
    return this.prisma.notificationModel.update({
      where: { id },
      data: { isReaded: true },
    });
  }

  async markAllRead(): Promise<{ count: number }> {
    return this.prisma.notificationModel.updateMany({
      where: { isReaded: false },
      data: { isReaded: true },
    });
  }

  async remove(id: string): Promise<NotificationModel> {
    return this.prisma.notificationModel.delete({
      where: { id },
    });
  }
}
