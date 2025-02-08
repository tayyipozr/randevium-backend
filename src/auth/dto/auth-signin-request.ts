import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class AuthSignInRequest {
  @IsString()
  @Length(8, 15)
  @IsNotEmpty()
  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
