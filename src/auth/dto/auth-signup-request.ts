import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class AuthSignUpRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  
  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  gender: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}