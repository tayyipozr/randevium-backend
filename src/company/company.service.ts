import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyRequestModel } from './model';
import { CompanyUpdateModel } from './model/company-update.model';

@Injectable()
export class CompanyService {
    constructor(private readonly prisma: PrismaService) { }
    
    async getCompanies() {
        return this.prisma.company.findMany();
    }

    async createCompany(model: CompanyRequestModel) {
        return this.prisma.company.create({
            data: model
        })
    }

    async updateCompany(id: string, model: CompanyUpdateModel) {
        return this.prisma.company.update({
            where: {
                id
            },
            data: model
        });
    }

    async deleteCompany(id: string) {
        return this.prisma.company.delete({
            where: {
                id
            }
        });
    }
}
