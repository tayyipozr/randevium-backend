import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class ServiceDetailsUpdateModel {
  @IsString()
  @IsNotEmpty()
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
  /*
    @IsUUID()
    @IsNotEmpty()
    @IsNotEmpty()
    @ApiProperty()
    serviceId: string;
    */
}
