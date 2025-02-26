import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './model';
import { LoggerService } from 'src/utils/logger/logger.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async createComment(userId: string, createCommentDto: CreateCommentDto) {
    this.logger.log(
      `User ${userId} requesting create comment`,
      'CommentService',
    );

    const comment = await this.prisma.commentModel.findFirst({
      where: {
        userId: userId,
        appoinmentId: createCommentDto.appoinmentId,
        companyId: createCommentDto.companyId,
      },
    });

    if (comment != null) {
      return await this.prisma.commentModel.update({
        where: {
          id: comment.id,
        },
        data: {
          comment: createCommentDto.comment,
          star: createCommentDto.star,
        },
      });
    }

    return await this.prisma.commentModel.create({
      data: {
        userId: userId,
        companyId: createCommentDto.companyId,
        appoinmentId: createCommentDto.appoinmentId,
        comment: createCommentDto.comment,
        star: createCommentDto.star,
      },
    });
  }

  async getCommentsByAppointment(appoinmentId: string) {
    return await this.prisma.commentModel.findMany({
      where: {
        appoinmentId,
      },
    });
  }

  async getCommentsByCompany(companyId: string) {
    return await this.prisma.commentModel.findMany({
      where: {
        appoinment: {
          appointmentDetail: {
            some: {
              serviceDetails: {
                some: {
                  employee: {
                    companyId: companyId,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getCommentsByUser(userId: string) {
    return await this.prisma.commentModel.findMany({
      where: { userId },
    });
  }

  async getCommentsByUserandAppointment(userId: string, appoinmentId: string) {
    const comment = await this.prisma.commentModel.findFirst({
      where: { userId: userId, appoinmentId: appoinmentId },
    });

    if (!comment) {
      throw new ForbiddenException('Yorum bulunamadı');
    }

    return comment;
  }
}
