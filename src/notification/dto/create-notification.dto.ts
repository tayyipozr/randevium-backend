import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isRead: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  appointmentId?: string;
}
