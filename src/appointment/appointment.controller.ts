import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { AppointmentService } from './appointment.service';
import { AppointmentRequestModel } from './model/appointment-request.model';
import { LoggerService } from 'src/utils';

@Controller('appointment')
export class AppointmentController {
    constructor(
        private readonly appointmentService: AppointmentService,
        private readonly logger: LoggerService
    ) { }

    @Get('user')
    async getByUserId(@GetUser('id') userId: string) {
        this.logger.log(`User ${userId} requesting their appointments`, 'AppointmentController');
        return await this.appointmentService.getByUserId(userId);
    }

    @Get('company/:companyId')
    async getByCompanyId(@Param('companyId') companyId: string) {
        this.logger.log(`Fetching appointments for company: ${companyId}`, 'AppointmentController');
        return await this.appointmentService.getByCompanyId(companyId);
    }

    @Get('employee/:employeeId')
    async getByEmployeeId(@Param('employeeId') employeeId: string) {
        this.logger.log(`Fetching appointments for employee: ${employeeId}`, 'AppointmentController');
        return await this.appointmentService.getByEmployeeId(employeeId);
    }

    @Post()
    async createAppointment(
        @GetUser('id') userId: string,
        @Body() model: AppointmentRequestModel
    ) {
        this.logger.log(`Creating new appointment for user: ${userId}`, 'AppointmentController');
        return await this.appointmentService.createAppointment(userId, model);
    }
}
