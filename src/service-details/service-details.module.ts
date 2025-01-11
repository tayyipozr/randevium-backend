import { Module } from '@nestjs/common';
import { ServiceDetailsController } from './service-details.controller';
import { ServiceDetailsService } from './service-details.service';

@Module({
  controllers: [ServiceDetailsController],
  providers: [ServiceDetailsService]
})
export class ServiceDetailsModule {}
