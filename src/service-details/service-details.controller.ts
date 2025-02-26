import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ServiceDetailsService } from './service-details.service';
import { ServiceDetailsRequestModel } from './model/service-details-request.model';
import { ServiceDetailsUpdateModel } from './model';

@Controller('service-detail')
export class ServiceDetailsController {
  constructor(private serviceDetailsService: ServiceDetailsService) {}

  @Post()
  createServiceDetail(@Body() model: ServiceDetailsRequestModel) {
    return this.serviceDetailsService.createServiceDetail(model);
  }

  @Get('employee/:employeeId')
  getEmployeeServiceDetails(@Param('employeeId') employeeId: string) {
    return this.serviceDetailsService.findByEmployee(employeeId);
  }

  @Put(':id')
  updateServiceDetail(
    @Param('id') id: string,
    @Body() model: ServiceDetailsUpdateModel,
  ) {
    return this.serviceDetailsService.updateServiceDetail(id, model);
  }
}
