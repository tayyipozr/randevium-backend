import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator"

export class CompanyRequestModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @Length(8, 15)
    @IsNotEmpty()
    @ApiProperty()
    phoneNumber: string

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    @ApiProperty()
    categoryIds?: string[];
}