import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentDetailService } from 'src/appointment-detail/appointment-detail.service';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentDetailService],
})
export class AppointmentModule {}
