import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentDetailService } from 'src/appointment-detail/appointment-detail.service';
import { LoggerService } from 'src/utils';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentDetailService, LoggerService],
})
export class AppointmentModule { }
