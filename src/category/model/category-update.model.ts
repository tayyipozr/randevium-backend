import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, Length } from "class-validator"

export class CategoryUpdateModel {
    @IsOptional()
    @IsString()
    @ApiProperty()
    name?: string
    
    @IsOptional()
    @IsString()
    @Length(10, 11)
    @ApiProperty()
    imageUrl?: string
}