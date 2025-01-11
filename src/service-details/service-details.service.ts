import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceDetailsRequestModel } from './model/service-details-request.model';

@Injectable()
export class ServiceDetailsService {
    constructor(private prisma: PrismaService) {}
  
    async createServiceDetails(model: ServiceDetailsRequestModel) {
      return await this.prisma.serviceDetails.create({
        data: {
          description: model.description,
          cost: model.cost,
          duration: model.duration,
          serviceId: model.serviceId,
          employeeId: model.employeeId
        }
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
  
    // ... other service details methods
  }