import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class ServiceDetailsRequestModel {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsPositive()
    cost: number;

    @IsNumber()
    @IsPositive()
    duration: number;

    @IsUUID()
    @IsNotEmpty()
    employeeId: string;

    @IsUUID()
    @IsNotEmpty()
    serviceId: string;
}