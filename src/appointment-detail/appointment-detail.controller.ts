import { Controller, Get, Param } from '@nestjs/common';
import { AppointmentDetailService } from './appointment-detail.service';
import { GetUser } from 'src/auth/decorator';

@Controller('appointment-detail')
export class AppointmentDetailController {
    constructor(private readonly appointmentDetailService: AppointmentDetailService) { }

    @Get('user')
    getEmployees(@GetUser('id') userId: string) {
        return this.appointmentDetailService.getByUserId(userId);
    }

    @Get('company/:companyId')
    getByCompanyId(@Param('companyId') companyId: string) {
        return this.appointmentDetailService.getByCompanyId(companyId);
    }

    @Get('employee/:employeeId')
    getByEmployeeId(@Param('employeeId') employeeId: string) {
        return this.appointmentDetailService.getByEmployeeId(employeeId);
    }


}
