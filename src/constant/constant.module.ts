import { Module } from '@nestjs/common';
import { ConstantController } from './constant.controller';
import { ConstantService } from './constant.service';
import { LoggerModule } from 'src/utils/logger/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [ConstantController],
  providers: [ConstantService],
})
export class ConstantModule {}
