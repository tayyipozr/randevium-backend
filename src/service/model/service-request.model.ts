import { IsNotEmpty, IsString, Length } from "class-validator";

export class ServiceRequestModel {
    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    name: string;
}
