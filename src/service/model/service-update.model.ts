import { IsOptional, IsString, Length } from "class-validator";

export class ServiceUpdateModel {
    @IsString()
    @Length(2, 50)
    @IsOptional()
    name?: string;
} 