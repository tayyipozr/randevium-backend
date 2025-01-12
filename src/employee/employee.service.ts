import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeRequestModel, EmployeeUpdateModel, UserEmployeeRequestModel } from './model';
import { AuthService } from 'src/auth/auth.service';
import { randomBytes } from 'crypto';
import { AuthSignUpRequest } from 'src/auth/dto';
import { ServiceDetailsRequestModel } from 'src/service-details/model/service-details-request.model';
import { Role } from 'src/auth/enum';
import { ServiceDetailsService } from 'src/service-details/service-details.service';

@Injectable()
export class EmployeeService {
    constructor(private readonly prisma: PrismaService,
        private readonly authService: AuthService,
        private readonly serviceDetailsService: ServiceDetailsService
    ) { }

    async getEmployees(companyId: string) {
        return await this.prisma.employee.findMany({
            where: {
                companyId
            },
            include: {
                serviceDetails: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                }
            }
        });
    }

    //TODO: Write a function that returns code for signing up employee to company

    async createEmployee(model: EmployeeRequestModel) {
        //TODO: Check if the code is correct before everything
        let user = await this.getUser(model.user.phoneNumber);

        if (!user) {
            const password = randomBytes(8).toString('base64').slice(0, 8);
            let singUpUser = this.maptoSingUpUserModel(model.user, password);
            await this.authService.signup(singUpUser);
            user = await this.getUser(model.user.phoneNumber);
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    roles: {
                        connect: {
                            name: Role.CompanyEmployee
                        }
                    }
                }
            });
            //TODO: Check if user created and if created notify user added to company with sms and send user to password
        }

        const employee = await this.prisma.employee.create({
            data: {
                description: model.description,
                companyId: model.companyId,
                userId: user.id
            }
        });

        let serviceDetails: ServiceDetailsRequestModel[] = 
            await this.serviceDetailsService.mapToEmployeeRequestToServiceDetails(model.serviceDetails, employee.id);

        await this.prisma.serviceDetails.createMany({
            data: serviceDetails
        });

        return employee;
    }

    private maptoSingUpUserModel(userInfo: UserEmployeeRequestModel, password: string) : AuthSignUpRequest {
        let singUpUser = new AuthSignUpRequest();
        singUpUser.email = userInfo.email;
        singUpUser.firstName = userInfo.firstName;
        singUpUser.lastName = userInfo.lastName;
        singUpUser.gender = userInfo.gender;
        singUpUser.phoneNumber = userInfo.phoneNumber;
        singUpUser.password = password;
        return singUpUser;
    }

    private async getUser(phoneNumber: string) {
        return await this.prisma.user.findUnique({
            where: {
                phoneNumber
            }
        });
    }

    async deleteEmployee(id: string) {
        return await this.prisma.employee.delete({
            where: {
                id
            }
        });
    }

    async updateEmployee(id: string, model: EmployeeUpdateModel) {
        const updateData: any = {};

        if (model.description !== undefined) updateData.description = model.description;
        if (model.companyId !== undefined) updateData.companyId = model.companyId;
        if (model.userId !== undefined) updateData.userId = model.userId;

        return await this.prisma.employee.update({
            where: {
                id: id
            },
            data: updateData,
            include: {
                user: true,
                company: true
            }
        });
    }
}
