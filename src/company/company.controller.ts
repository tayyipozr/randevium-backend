import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyRequestModel } from './model';
import { CompanyUpdateModel } from './model/company-update.model';

@Controller('company')
export class CompanyController {
    constructor(private companyService: CompanyService) { }
    @Get()
    getCompanies() {
        return this.companyService.getCompanies();
    }

    @Post()
    createCompany(@Body() model: CompanyRequestModel) {
        return this.companyService.createCompany(model);
    }

    @Put(':id')
    updateCategory(@Param('id') id: string, @Body() model: CompanyUpdateModel) {
        return this.companyService.updateCompany(id, model);
    }

    @Delete(':id')
    deleteCategory(@Param('id') id: string) {
        return this.companyService.deleteCompany(id);
    }
}
