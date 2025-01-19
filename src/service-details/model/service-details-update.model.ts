import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Length } from "class-validator";

export class ServiceDetailsUpdateModel {
    @IsString()
    @IsNotEmpty()
    @Length(10, 150)
    @ApiProperty()
    description: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    cost: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    duration: number;
    /*
    @IsUUID()
    @IsNotEmpty()
    @IsNotEmpty()
    @ApiProperty()
    serviceId: string;
    */
}