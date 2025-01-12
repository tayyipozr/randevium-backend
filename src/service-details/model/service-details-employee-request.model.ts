import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class ServiceDetailsEmployeeRequestModel {
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
    serviceId: string;
}