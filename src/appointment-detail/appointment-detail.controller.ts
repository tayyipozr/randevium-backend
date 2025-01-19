import { Controller, Get } from '@nestjs/common';
import { AppointmentDetailService } from './appointment-detail.service';
import { GetUser } from 'src/auth/decorator';

@Controller('appointment-detail')
export class AppointmentDetailController {
    constructor(private readonly appointmentDetailService: AppointmentDetailService) { }

    @Get('user')
    getEmployees(@GetUser('id') userId: string) {
        return this.appointmentDetailService.getByUserId(userId);
    }
}
