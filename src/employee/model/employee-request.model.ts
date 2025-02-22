import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { UserEmployeeRequestModel } from './user-employee-request.model';
import { ServiceDetailsRequestModel } from 'src/service-details/model';

export class EmployeeRequestModel {
  @IsString()
  @Length(10, 150)
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  companyId: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  serviceDetails?: ServiceDetailsRequestModel[];

  @IsNotEmpty()
  @ApiProperty()
  user: UserEmployeeRequestModel;
}
