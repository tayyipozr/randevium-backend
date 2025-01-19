import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceDetailsRequestModel } from './model/service-details-request.model';
import { ServiceDetailsUpdateModel } from './model';

@Injectable()
export class ServiceDetailsService {
  // Mapper for single service detail (with relations)
  constructor(private prisma: PrismaService) { }

  async createServiceDetail(model: ServiceDetailsRequestModel) {
    return await this.prisma.serviceDetails.create({
      data: model
    });
  }

  async createServiceDetails(models: ServiceDetailsRequestModel[]) {
    return await this.prisma.serviceDetails.createMany({
      data: models
    });
  }

  async findByEmployee(employeeId: string) {
    return await this.prisma.serviceDetails.findMany({
      where: { employeeId },
      include: {
        service: {
          include: { images: true }
        }
      }
    });
  }

  async updateServiceDetail(id: string, model: ServiceDetailsUpdateModel) {
    return await this.prisma.serviceDetails.update({
      where: { id },
      data: model
    });
  }
}