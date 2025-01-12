import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyRequestModel } from './model';
import { CompanyUpdateModel } from './model/company-update.model';

@Injectable()
export class CompanyService {
    constructor(private readonly prisma: PrismaService) { }

    async getCompanies() {
        return await this.prisma.company.findMany({
            include: {
                images: true,
                category: true,
                companySettings: {
                    include: {
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
    }

    async getCompanyById(id: string) {
        return await this.prisma.company.findUnique({
            where: {
                id
            },
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
        return await this.prisma.company.create({
            data: model
        })
    }

    async updateCompany(id: string, model: CompanyUpdateModel) {
        return await this.prisma.company.update({
            where: {
                id
            },
            data: model
        });
    }

    async deleteCompany(id: string) {
        return await this.prisma.company.delete({
            where: {
                id
            }
        });
    }
}
