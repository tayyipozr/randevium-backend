import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from 'src/utils/logger/logger.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, PrismaService, LoggerService],
  exports: [UploadService],
})
export class UploadModule {}
