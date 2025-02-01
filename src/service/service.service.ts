import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceRequestModel, ServiceUpdateModel } from './model';
import { DragonflyService } from 'src/dragonfly';
import { LoggerService } from 'src/utils';

@Injectable()
export class ServiceService {
    private readonly CACHE_KEY = 'services';

    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: DragonflyService,
        private readonly logger: LoggerService
    ) { }

    async getServices() {
        this.logger.log('Fetching all services', 'ServiceService');

        // Try to get from cache first
        const cached = await this.cache.getJson<any[]>(this.CACHE_KEY);

        if (cached) {
            this.logger.log('Services retrieved from cache', 'ServiceService');
            return cached;
        }

        this.logger.log('Cache miss, fetching from database', 'ServiceService');
        const services = await this.prisma.service.findMany();

        // Store in cache
        await this.cache.setJson(this.CACHE_KEY, services);
        this.logger.log('Services cached successfully', 'ServiceService');

        return services;
    }

    async getServicesByCategory(categoryId: string) {
        this.logger.log(`Fetching services for category: ${categoryId}`, 'ServiceService');
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
        this.logger.log(`Creating new service for company: ${companyId}`, 'ServiceService');
        try {
            const service = await this.prisma.service.create({
                data: model
            });

            // Invalidate cache after creating new service
            await this.cache.deleteString(this.CACHE_KEY);
            this.logger.log(`Service created successfully: ${service.id}`, 'ServiceService');

            return service;
        } catch (error) {
            this.logger.error(
                `Failed to create service for company: ${companyId}`,
                error.stack,
                'ServiceService'
            );
            throw error;
        }
    }

    async deleteService(id: string) {
        this.logger.log(`Deleting service: ${id}`, 'ServiceService');
        try {
            const service = await this.prisma.service.delete({
                where: { id }
            });

            // Invalidate cache after deleting service
            await this.cache.deleteString(this.CACHE_KEY);
            this.logger.log(`Service deleted successfully: ${id}`, 'ServiceService');

            return service;
        } catch (error) {
            this.logger.error(`Failed to delete service: ${id}`, error.stack, 'ServiceService');
            throw error;
        }
    }

    async updateService(id: string, model: ServiceUpdateModel) {
        this.logger.log(`Updating service: ${id}`, 'ServiceService');
        try {
            const service = await this.prisma.service.update({
                where: { id },
                data: model
            });

            // Invalidate cache after updating service
            await this.cache.deleteString(this.CACHE_KEY);
            this.logger.log(`Service updated successfully: ${id}`, 'ServiceService');

            return service;
        } catch (error) {
            this.logger.error(`Failed to update service: ${id}`, error.stack, 'ServiceService');
            throw error;
        }
    }
}
