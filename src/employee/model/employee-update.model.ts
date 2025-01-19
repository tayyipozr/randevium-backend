import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class EmployeeUpdateModel {
    @IsString()
    @Length(10, 150)
    @IsOptional()
    @ApiProperty()
    description?: string;

    @IsUUID()
    @IsOptional()
    @ApiProperty()
    companyId?: string;
} 