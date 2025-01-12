import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { AppointmentService } from './appointment.service';
import { AppointmentRequestModel } from './model/appointment-request.model';

@Controller('appointment')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}

    @Get('user')
    getByUserId(@GetUser('id') userId: string) {
        return this.appointmentService.getByUserId(userId);
    }

    @Get('company/:companyId')
    getByCompanyId(@Param('companyId') companyId: string) {
        return this.appointmentService.getByCompanyId(companyId);
    }

    @Get('employee/:employeeId')
    getByEmployeeId(@Param('employeeId') employeeId: string) {
        return this.appointmentService.getByEmployeeId(employeeId);
    }

    @Post()
    createAppointment(@GetUser('id') userId: string, @Body() model: AppointmentRequestModel) {
        return this.appointmentService.createAppointment(userId, model);
    }
}
