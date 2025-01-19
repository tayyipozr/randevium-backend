import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { IsArray, IsNotEmpty, IsPhoneNumber, IsString, IsUUID, Length } from "class-validator";
import { AuthSignUpRequest } from "src/auth/dto";
import { ServiceDetailsUpdateModel } from "src/service-details/model/service-details-update.model";
import { UserEmployeeRequestModel } from "./user-employee-request.model";
import { ServiceDetailsRequestModel } from "src/service-details/model";

export class EmployeeRequestModel {
    @IsString()
    @Length(10, 150)
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    companyId: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    serviceDetails: ServiceDetailsRequestModel[];

    @IsNotEmpty()
    @ApiProperty()
    user: UserEmployeeRequestModel
}