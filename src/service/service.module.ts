import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { DragonflyModule } from 'src/dragonfly/dragonfly.module';
import { LoggerService } from 'src/utils';

@Module({
  imports: [DragonflyModule],
  controllers: [ServiceController],
  providers: [ServiceService, LoggerService]
})
export class ServiceModule { }
