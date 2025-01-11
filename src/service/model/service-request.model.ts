import { IsNotEmpty, IsString } from "class-validator";

export class ServiceRequestModel {
    @IsString()
    @IsNotEmpty()
    name: string;
}
