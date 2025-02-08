import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './model';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(userId: string, createCommentDto: CreateCommentDto) {
    return this.prisma.commentModel.create({
      data: {
        userId: userId,
        companyId: createCommentDto.companyId,
        comment: createCommentDto.comment,
        star: createCommentDto.star,
      },
    });
  }

  async getCommentsByCompany(companyId: string) {
    return this.prisma.commentModel.findMany({
      where: { companyId },
    });
  }

  async getCommentsByUser(userId: string) {
    return this.prisma.commentModel.findMany({
      where: { userId },
    });
  }
}
