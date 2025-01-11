import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator"

export class CompanyUpdateModel {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Length(2, 30)
    @ApiProperty()
    name?: string

    @IsString()
    @Length(8, 15)
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty()
    phoneNumber?: string

    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    addressId?: string 
}