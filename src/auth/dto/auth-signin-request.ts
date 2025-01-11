import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class AuthSignInRequest {
  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}