import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enum';
import { EmployeeService } from './employee.service';
import { EmployeeRequestModel, EmployeeUpdateModel } from './model';
import { EmployeeWorkingDaysUpdateModel } from './model/employee-working-days-update.model';

@Controller('employee')
@Roles(Role.CompanyAdmin)
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get(':companyId')
  getEmployees(@Param('companyId') companyId: string) {
    return this.employeeService.getEmployees(companyId);
  }

  @Get('working-days/:employeeSettingsId')
  getEmployeeWorkingDays(
    @Param('employeeSettingsId') employeeSettingsId: string,
  ) {
    return this.employeeService.getEmployeeWorkingDays(employeeSettingsId);
  }

  @Put('working-days/:employeeSettingsId')
  updateEmployeeWorkingDays(
    @Param('employeeSettingsId') employeeSettingsId: string,
    @Body() workingDays: EmployeeWorkingDaysUpdateModel,
  ) {
    return this.employeeService.updateEmployeeWorkingDays(
      employeeSettingsId,
      workingDays,
    );
  }

  @Post()
  createEmployee(@Body() model: EmployeeRequestModel) {
    return this.employeeService.createEmployee(model);
  }

  @Put(':id')
  updateEmployee(@Param('id') id: string, @Body() model: EmployeeUpdateModel) {
    return this.employeeService.updateEmployee(id, model);
  }

  @Put(':id/company')
  updateEmployeeCompany(@Param('id') id: string, @Body() companyId: string) {
    return this.employeeService.updateEmployeeCompany(id, companyId);
  }

  @Delete(':id')
  deleteEmployee(@Param('id') id: string) {
    return this.employeeService.deleteEmployee(id);
  }
}
