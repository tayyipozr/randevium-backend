import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeRequestModel, EmployeeUpdateModel } from './model';

@Injectable()
export class EmployeeService {
    constructor(private readonly prisma: PrismaService) { }

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

    async createEmployee(model: EmployeeRequestModel) {
        return await this.prisma.employee.create({
            data: model
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
