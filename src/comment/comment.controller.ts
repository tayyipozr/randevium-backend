import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './model';
import { GetUser } from 'src/auth/decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('')
  async create(
    @GetUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(userId, createCommentDto);
  }

  @Get('appointment/:appointmentId')
  async getCommentsByAppointment(
    @Param('appointmentId') appointmentId: string,
  ) {
    return this.commentService.getCommentsByAppointment(appointmentId);
  }

  @Get('company/:id')
  async findByCompany(@Param('id') companyId: string) {
    return this.commentService.getCommentsByCompany(companyId);
  }

  @Get('user/:id')
  async findByUser(@Param('userId') userId: string) {
    return this.commentService.getCommentsByUser(userId);
  }

  @Get('user-appointment/:appoinmentId')
  async getCommentsByUserandAppointment(
    @GetUser('id') userId: string,
    @Param('appoinmentId') appoinmentId: string,
  ) {
    return await this.commentService.getCommentsByUserandAppointment(
      userId,
      appoinmentId,
    );
  }
}
