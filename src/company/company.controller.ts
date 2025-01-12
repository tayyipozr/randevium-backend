import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyRequestModel } from './model';
import { CompanyUpdateModel } from './model/company-update.model';
import { Role } from 'src/auth/enum';
import { Roles } from 'src/auth/decorator';

@Controller('company')
export class CompanyController {
    constructor(private companyService: CompanyService) { }
    @Get()
    getCompanies() {
        return this.companyService.getCompanies();
    }

    @Get(':id')
    getCompanyById(@Param('id') id: string) {
        return this.companyService.getCompanyById(id);
    }

    @Get(':id/working-days')
    getCompanyWorkingDays(@Param('id') id: string) {
        return this.companyService.getCompanyWorkingDays(id);
    }

    @Post()
    @Roles(Role.Admin)
    createCompany(@Body() model: CompanyRequestModel) {
        return this.companyService.createCompany(model);
    }

    @Put(':id')
    @Roles(Role.CompanyAdmin)
    updateCategory(@Param('id') id: string, @Body() model: CompanyUpdateModel) {
        return this.companyService.updateCompany(id, model);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    deleteCategory(@Param('id') id: string) {
        return this.companyService.deleteCompany(id);
    }
}
