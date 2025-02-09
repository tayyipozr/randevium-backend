import { Controller, Get, Param } from '@nestjs/common';
import { AppointmentDetailService } from './appointment-detail.service';
import { GetUser } from 'src/auth/decorator';
import { LoggerService } from 'src/utils';

@Controller('appointment-detail')
export class AppointmentDetailController {
  constructor(
    private readonly appointmentDetailService: AppointmentDetailService,
    private readonly logger: LoggerService,
  ) {}

  @Get('detail/:id')
  async getByAppoinmentDetailId(
    @Param('appoinmentDetailId') appoinmentDetailId: string,
  ) {
    this.logger.log(
      `Fetching appointment details for appoinmentDetailId: ${appoinmentDetailId}`,
      'AppointmentDetailController',
    );
    return await this.appointmentDetailService.getByAppoinmentDetailId(
      appoinmentDetailId,
    );
  }

  @Get('user')
  async getByUserId(@GetUser('id') userId: string) {
    this.logger.log(
      `User ${userId} requesting their appointment details`,
      'AppointmentDetailController',
    );
    return await this.appointmentDetailService.getByUserId(userId);
  }

  @Get('company/:companyId')
  async getByCompanyId(@Param('companyId') companyId: string) {
    this.logger.log(
      `Fetching appointment details for company: ${companyId}`,
      'AppointmentDetailController',
    );
    return await this.appointmentDetailService.getByCompanyId(companyId);
  }

  @Get('employee/:employeeId')
  async getByEmployeeId(@Param('employeeId') employeeId: string) {
    this.logger.log(
      `Fetching appointment details for employee: ${employeeId}`,
      'AppointmentDetailController',
    );
    return await this.appointmentDetailService.getByEmployeeId(employeeId);
  }
}
