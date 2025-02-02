import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyRequestModel } from './model';
import { CompanyUpdateModel } from './model/company-update.model';
import { DragonflyService } from 'src/dragonfly';
import { LoggerService } from 'src/utils/logger/logger.service';

@Injectable()
export class CompanyService {
    private readonly COMPANIES_CACHE_KEY = 'companies';
    private readonly COMPANY_CACHE_KEY = 'company:';

    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: DragonflyService,
        private readonly logger: LoggerService,
    ) { }

    async getCompanies() {
        // Try to get from cache first
        const cached = await this.cache.getJson<any[]>(this.COMPANIES_CACHE_KEY);

        if (cached) {
            this.logger.log("Cache hit for companies", CompanyService.name);
            return cached;
        }
        this.logger.log("Cache miss for companies", "CompanyService");

        // If not in cache, get from database
        const companies = await this.prisma.company.findMany({
            include: {
                images: true,
                category: true,
                companySettings: {
                    include: {
                        workingDays: true,
                        companyAddress: {
                            include: {
                                city: true,
                                country: true,
                                district: true,
                                location: true
                            }
                        }
                    }
                },
            }
        });

        // Store in cache
        await this.cache.setJson(this.COMPANIES_CACHE_KEY, companies);

        return companies;
    }

    async getCompanyById(id: string) {
        // Try to get from cache first
        const cached = await this.cache.getJson<any>(this.COMPANY_CACHE_KEY + id);

        if (cached) {
            this.logger.log(`Cache hit for company ${id}`, "CompanyService");
            return cached;
        }
        this.logger.log(`Cache miss for company ${id}`, "CompanyService");

        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                images: true,
                category: true,
                employees: {
                    include: {
                        serviceDetails: {
                            include: {
                                service: true
                            }
                        }
                    }
                },
                companySettings: {
                    include: {
                        companyAddress: {
                            include: {
                                city: true,
                                country: true,
                                district: true,
                                location: true
                            }
                        },
                        workingDays: true
                    }
                },
            }
        });

        if (company) {
            // Store in cache
            await this.cache.setJson(this.COMPANY_CACHE_KEY + id, company);
        }

        return company;
    }

    async getCompanyWorkingDays(id: string) {
        return await this.prisma.workingCompanyDays.findMany({
            where: {
                companySettings: {
                    companyId: id
                }
            },
            include: {
                companySettings: {
                    select: {
                        companyId: true
                    }
                }
            }
        });
    }

    async createCompany(model: CompanyRequestModel) {
        this.logger.log('Creating new company', 'CompanyService');
        const company = await this.prisma.company.create({
            data: model
        });

        // Invalidate companies cache
        await this.cache.deleteString(this.COMPANIES_CACHE_KEY);

        return company;
    }

    async updateCompany(id: string, model: CompanyUpdateModel) {
        const company = await this.prisma.company.update({
            where: { id },
            data: model
        });

        // Invalidate both caches
        await this.cache.deleteString(this.COMPANIES_CACHE_KEY);
        await this.cache.deleteString(this.COMPANY_CACHE_KEY + id);

        return company;
    }

    async deleteCompany(id: string) {
        const company = await this.prisma.company.delete({
            where: { id }
        });

        // Invalidate both caches
        await this.cache.deleteString(this.COMPANIES_CACHE_KEY);
        await this.cache.deleteString(this.COMPANY_CACHE_KEY + id);

        return company;
    }
}
