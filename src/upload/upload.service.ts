import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async saveImage(
    imageUrl: string,
    entityId: string,
    entityType: string,
    order: number = 0,
  ) {
    switch (entityType) {
      case 'comment':
        return this.prisma.commentImage.create({
          data: { imageUrl, commentId: entityId, order },
        });
      case 'user':
        return this.prisma.userImage.create({
          data: { imageUrl, userId: entityId, order },
        });
      case 'company':
        return this.prisma.companyImage.create({
          data: { imageUrl, companyId: entityId, order },
        });
      case 'category':
        return this.prisma.categoryImage.create({
          data: { imageUrl, categoryId: entityId, order },
        });
      case 'employee':
        return this.prisma.employeeImage.create({
          data: { imageUrl, employeeId: entityId, order },
        });
      case 'service':
        return this.prisma.serviceImage.create({
          data: { imageUrl, serviceId: entityId, order },
        });
      default:
        throw new BadRequestException('Resim Yüklenemedi!');
    }
  }

  async getImages(entityId: string, entityType: string) {
    switch (entityType) {
      case 'comment':
        return this.prisma.commentImage.findMany({
          where: { commentId: entityId },
          orderBy: { order: 'asc' },
        });
      case 'user':
        return this.prisma.userImage.findMany({
          where: { userId: entityId },
          orderBy: { order: 'asc' },
        });
      case 'company':
        return this.prisma.companyImage.findMany({
          where: { companyId: entityId },
          orderBy: { order: 'asc' },
        });
      case 'category':
        return this.prisma.categoryImage.findMany({
          where: { categoryId: entityId },
          orderBy: { order: 'asc' },
        });
      case 'employee':
        return this.prisma.employeeImage.findMany({
          where: { employeeId: entityId },
          orderBy: { order: 'asc' },
        });
      case 'service':
        return this.prisma.serviceImage.findMany({
          where: { serviceId: entityId },
          orderBy: { order: 'asc' },
        });
      default:
        throw new BadRequestException('Resim bulunamadı!');
    }
  }
}
