import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsOptional, IsString, IsUUID, Length } from "class-validator"

export class CompanyUpdateModel {
    @IsString()
    @IsOptional()
    @Length(2, 40)
    @ApiProperty()
    name?: string

    @IsString()
    @Length(8, 15)
    @IsOptional()
    @ApiProperty()
    phoneNumber?: string

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    @ApiProperty()
    categoryIds?: string[];
}
