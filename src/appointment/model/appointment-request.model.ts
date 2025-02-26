import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { AppointmentDetailRequestModel } from 'src/appointment-detail/model/appointment-detail-request-model';

export class AppointmentRequestModel {
  @IsArray()
  @ApiProperty()
  appointmentDetails: AppointmentDetailRequestModel[];

  @IsArray()
  @ApiProperty()
  @IsOptional()
  userIds: string[];
}
