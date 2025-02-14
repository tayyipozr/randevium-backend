import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceDetailsRequestModel } from './model/service-details-request.model';
import { ServiceDetailsUpdateModel } from './model';
import { LoggerService } from 'src/utils';

@Injectable()
export class ServiceDetailsService {
  // Mapper for single service detail (with relations)
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async createServiceDetail(model: ServiceDetailsRequestModel) {
    this.logger.log(
      `Creating service detail for employee: ${model.employeeId}`,
      'ServiceDetailsService',
    );
    try {
      const result = await this.prisma.serviceDetails.create({
        data: model,
      });
      this.logger.log(
        `Service detail created successfully: ${result.id}`,
        'ServiceDetailsService',
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to create service detail for employee: ${model.employeeId}`,
        error.stack,
        'ServiceDetailsService',
      );
      throw error;
    }
  }

  async createServiceDetails(models: ServiceDetailsRequestModel[]) {
    this.logger.log(
      `Creating multiple service details`,
      'ServiceDetailsService',
    );
    try {
      const result = await this.prisma.serviceDetails.createMany({
        data: models,
      });
      this.logger.log(
        `Created ${result.count} service details`,
        'ServiceDetailsService',
      );
      return result;
    } catch (error) {
      this.logger.error(
        'Failed to create multiple service details',
        error.stack,
        'ServiceDetailsService',
      );
      throw error;
    }
  }

  async findByEmployee(employeeId: string) {
    this.logger.log(
      `Fetching service details for employee: ${employeeId}`,
      'ServiceDetailsService',
    );
    return await this.prisma.serviceDetails.findMany({
      where: { employeeId },
      include: {
        service: {
          include: { images: true },
        },
      },
    });
  }

  async updateServiceDetail(id: string, model: ServiceDetailsUpdateModel) {
    this.logger.log(`Updating service detail: ${id}`, 'ServiceDetailsService');
    try {
      const result = await this.prisma.serviceDetails.update({
        where: { id },
        data: model,
      });
      this.logger.log(
        `Service detail updated successfully: ${id}`,
        'ServiceDetailsService',
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update service detail: ${id}`,
        error.stack,
        'ServiceDetailsService',
      );
      throw error;
    }
  }
}
