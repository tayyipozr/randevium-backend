import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enum';
import { ServiceService } from './service.service';
import { ServiceRequestModel, ServiceUpdateModel } from './model';

@Controller('service')
@Roles(Role.CompanyAdmin)
export class ServiceController {
    constructor(private serviceService: ServiceService) { }

    @Get()
    getServices() {
        return this.serviceService.getServices();
    }

    @Get(':categoryId')
    getServicesByCategory(@Param('categoryId') categoryId: string) {
        return this.serviceService.getServicesByCategory(categoryId);
    }

    @Post()
    createService(@Param('companyId') companyId: string, @Body() model: ServiceRequestModel) {
        return this.serviceService.createService(companyId, model);
    }

    @Put(':id')
    updateService(@Param('id') id: string, @Body() model: ServiceUpdateModel) {
        return this.serviceService.updateService(id, model);
    }

    @Delete(':id')
    deleteService(@Param('id') id: string) {
        return this.serviceService.deleteService(id);
    }
}
