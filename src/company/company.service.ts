import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyRequestModel, CompanyWorkingDaysUpdateModel } from './model';
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
  ) {}

  async getCompanies() {
    // Try to get from cache first
    const cached = await this.cache.getJson<any[]>(this.COMPANIES_CACHE_KEY);

    if (cached) {
      this.logger.log('Cache hit for companies', CompanyService.name);
      return cached;
    }
    this.logger.log('Cache miss for companies', 'CompanyService');

    // If not in cache, get from database
    const companies = await this.prisma.company.findMany({
      include: {
        images: true,
        category: true,
        comments: true,
        companySettings: {
          include: {
            companyAddress: {
              include: {
                city: true,
                country: true,
                district: true,
                location: true,
              },
            },
          },
        },
      },
    });

    // Store in cache
    await this.cache.setJson(this.COMPANIES_CACHE_KEY, companies);

    return companies;
  }

  async getCompanyById(id: string) {
    // Try to get from cache first
    const cached = await this.cache.getJson<any>(this.COMPANY_CACHE_KEY + id);

    if (cached) {
      this.logger.log(`Cache hit for company ${id}`, 'CompanyService');
      return cached;
    }
    this.logger.log(`Cache miss for company ${id}`, 'CompanyService');

    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        comments: {
          include: {
            user: true,
          },
        },
        employees: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
                images: true,
              },
            },
            company: true,
            serviceDetails: {
              include: {
                service: true,
              },
            },
            employeeSettings: {
              include: {
                workingDays: true,
              },
            },
          },
        },
        companySettings: {
          include: {
            workingDays: true,
            companyAddress: {
              include: {
                city: true,
                country: true,
                district: true,
                location: true,
              },
            },
          },
        },
      },
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
          companyId: id,
        },
      },
      include: {
        companySettings: {
          select: {
            companyId: true,
          },
        },
      },
    });
  }

  async updateCompanyWorkingDays(
    companySettingsId: string,
    model: CompanyWorkingDaysUpdateModel,
  ) {
    this.logger.log(
      `updateCompanyWorkingDays: ${model.workingDays}`,
      'CompanyService',
    );

    const newWorkingDays = model.workingDays.filter((day) => !day.id);

    const existingWorkingDays = model.workingDays.filter((day) => !!day.id);

    await Promise.all(
      existingWorkingDays.map((day) =>
        this.prisma.workingCompanyDays.update({
          where: { id: day.id },
          data: {
            startTime: day.startTime,
            endTime: day.endTime,
            status: day.status,
          },
        }),
      ),
    );

    if (newWorkingDays.length > 0) {
      await Promise.all(
        newWorkingDays.map((day) =>
          this.prisma.workingCompanyDays.create({
            data: {
              day: day.day,
              startTime: day.startTime,
              endTime: day.endTime,
              status: day.status,
              companySettingsId: companySettingsId,
            },
          }),
        ),
      );
    }

    return 'Başarılı';
  }

  async createCompany(model: CompanyRequestModel) {
    this.logger.log('Creating new company', 'CompanyService');
    const company = await this.prisma.company.create({
      data: model,
    });

    // Invalidate companies cache
    await this.cache.deleteString(this.COMPANIES_CACHE_KEY);

    return company;
  }

  async updateCompany(id: string, model: CompanyUpdateModel) {
    const company = await this.prisma.company.update({
      where: { id },
      data: model,
    });

    // Invalidate both caches
    await this.cache.deleteString(this.COMPANIES_CACHE_KEY);
    await this.cache.deleteString(this.COMPANY_CACHE_KEY + id);

    return company;
  }

  async deleteCompany(id: string) {
    const company = await this.prisma.company.delete({
      where: { id },
    });

    // Invalidate both caches
    await this.cache.deleteString(this.COMPANIES_CACHE_KEY);
    await this.cache.deleteString(this.COMPANY_CACHE_KEY + id);

    return company;
  }

  async favoriteCompany(
    userId: string,
    companyId: string,
    isFavorite: boolean,
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteCompanies: isFavorite
          ? { connect: { id: companyId } } // Add user to company's fans list
          : { disconnect: { id: companyId } }, // Remove user from company's fans list
      },
    });
  }
}
