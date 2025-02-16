import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class ServiceDetailsRequestModel {
  @IsString()
  @Length(10, 150)
  @ApiProperty()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  cost: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  duration: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  canBeGroup: boolean;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  employeeId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  serviceId: string;
}
