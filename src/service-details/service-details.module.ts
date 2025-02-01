import { Module } from '@nestjs/common';
import { ServiceDetailsController } from './service-details.controller';
import { ServiceDetailsService } from './service-details.service';
import { LoggerService } from 'src/utils';

@Module({
  controllers: [ServiceDetailsController],
  providers: [ServiceDetailsService, LoggerService]
})
export class ServiceDetailsModule { }
