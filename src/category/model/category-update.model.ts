import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, Length } from "class-validator"

export class CategoryUpdateModel {
    @IsOptional()
    @Length(2, 40)
    @IsString()
    @ApiProperty()
    name?: string
    
    @IsOptional()
    @IsString()
    @ApiProperty()
    imageUrl?: string
}