import { Module } from '@nestjs/common';
import { AppointmentDetailService } from './appointment-detail.service';
import { AppointmentDetailController } from './appointment-detail.controller';
import { LoggerService } from 'src/utils';

@Module({
  providers: [AppointmentDetailService, LoggerService],
  controllers: [AppointmentDetailController]
})
export class AppointmentDetailModule { }
