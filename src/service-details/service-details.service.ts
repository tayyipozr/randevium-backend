import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceDetailsRequestModel } from './model/service-details-request.model';
import { ServiceDetailsEmployeeRequestModel } from './model/service-details-employee-request.model';

@Injectable()
export class ServiceDetailsService {
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

  // Mapper for single service detail (with relations)
  async mapToPrismaServiceDetail(data: ServiceDetailsEmployeeRequestModel, employeeId: string): Promise<ServiceDetailsRequestModel> {
    return {
      description: data.description,
      cost: data.cost,
      duration: data.duration,
      serviceId: data.serviceId,
      employeeId: employeeId
    };
  }

  // Mapper for multiple service details (without relations for createMany)
  async mapToEmployeeRequestToServiceDetails(data: ServiceDetailsEmployeeRequestModel[], employeeId: string): Promise<ServiceDetailsRequestModel[]> {
    return data.map(item => ({
      description: item.description,
      cost: item.cost,
      duration: item.duration,
      serviceId: item.serviceId,
      employeeId: employeeId
    }));
  }
}