import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator"

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

    @IsNotEmpty()
    @IsUUID()
    categoryId: string
    
    @IsNotEmpty()
    @IsOptional()
    @IsUUID()
    addressId: string 
}