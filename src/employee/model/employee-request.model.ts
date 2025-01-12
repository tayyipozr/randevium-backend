import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { IsArray, IsNotEmpty, IsPhoneNumber, IsString, IsUUID, Length } from "class-validator";
import { AuthSignUpRequest } from "src/auth/dto";
import { ServiceDetailsEmployeeRequestModel } from "src/service-details/model/service-details-employee-request.model";
import { UserEmployeeRequestModel } from "./user-employee-request.model";

export class EmployeeRequestModel {
    @IsString()
    @Length(10, 150)
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsUUID()
    @IsNotEmpty()
    companyId: string;

    @IsArray()
    @IsNotEmpty()
    serviceDetails: ServiceDetailsEmployeeRequestModel[];

    @IsNotEmpty()
    user: UserEmployeeRequestModel
}