import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/utils/logger/logger.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [LoggerModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
