import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator"

export class CategoryRequestModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @Length(10, 11)
    @IsNotEmpty()
    @ApiProperty()
    imageUrl: string
}