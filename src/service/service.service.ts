import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceRequestModel, ServiceUpdateModel } from './model';

@Injectable()
export class ServiceService {
    constructor(private readonly prisma: PrismaService) { }

    async getServices() {
        return await this.prisma.service.findMany();
    }

    async getServicesByCategory(categoryId: string) {
        return await this.prisma.service.findMany({
            where: {
                category: {
                    some: {
                        id: categoryId
                    }
                }
            }
        });
    }
    
    async createService(companyId: string, model: ServiceRequestModel) {
        return await this.prisma.service.create({
            data: model
        });
    }

    async deleteService(id: string) {
        return await this.prisma.service.delete({
            where: { id }
        });
    }

    async updateService(id: string, model: ServiceUpdateModel) {
        return await this.prisma.service.update({
            where: { id },
            data: model
        });
    }
}
