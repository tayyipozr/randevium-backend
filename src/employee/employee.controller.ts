import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enum';
import { EmployeeService } from './employee.service';
import { EmployeeRequestModel, EmployeeUpdateModel } from './model';

@Controller('employee')
@Roles(Role.Admin)
export class EmployeeController {
    constructor(private employeeService: EmployeeService) { }

    @Get(':companyId')
    getEmployees(@Param('companyId') companyId: string) {
        return this.employeeService.getEmployees(companyId);
    }

    @Post()
    createEmployee(@Body() model: EmployeeRequestModel) {
        return this.employeeService.createEmployee(model);
    }

    @Put(':id')
    updateEmployee(@Param('id') id: string, @Body() model: EmployeeUpdateModel) {
        return this.employeeService.updateEmployee(id, model);
    }

    @Delete(':id')
    deleteEmployee(@Param('id') id: string) {
        return this.employeeService.deleteEmployee(id);
    }
}
