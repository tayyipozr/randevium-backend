import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  LoggerService,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './model';
import { GetUser } from 'src/auth/decorator';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async create(
    @GetUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    this.logger.log(
      `User ${userId} requesting create comment`,
      'CommentController',
    );
    return this.commentService.createComment(userId, createCommentDto);
  }

  @Get('company/:id')
  async findByCompany(@Param('id') companyId: string) {
    return this.commentService.getCommentsByCompany(companyId);
  }

  @Get('user/:id')
  async findByUser(@GetUser('id') userId: string) {
    return this.commentService.getCommentsByUser(userId);
  }
}
