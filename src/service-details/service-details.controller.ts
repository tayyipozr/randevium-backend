import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ServiceDetailsService } from './service-details.service';
import { ServiceDetailsRequestModel } from './model/service-details-request.model';

@Controller('services/:serviceId/details')
export class ServiceDetailsController {
    constructor(private serviceDetailsService: ServiceDetailsService) { }

    @Post()
    createServiceDetails(@Body() model: ServiceDetailsRequestModel) {
        return this.serviceDetailsService.createServiceDetails(model);
    }

    @Get('employee/:employeeId')
    getEmployeeServiceDetails(@Param('employeeId') employeeId: string) {
        return this.serviceDetailsService.findByEmployee(employeeId);
    }
}