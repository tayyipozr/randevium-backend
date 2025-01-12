import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator"

export class AppointmentDetailRequestModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    appointmentDateTime: string

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    @ApiProperty()
    serviceDetails: string[];
}