import { Injectable } from '@nestjs/common';
import { AppointmentRequestModel } from './model/appointment-request.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentStatus } from './enum';
import { AppointmentDetailService } from 'src/appointment-detail/appointment-detail.service';

@Injectable()
export class AppointmentService {
    constructor(private readonly prisma: PrismaService,
        private readonly appointmentDetailService: AppointmentDetailService
    ) { }

    async getByUserId(userId: string) {
        return await this.prisma.appointment.findMany({
            where: {
                AppointmentDetail: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                AppointmentDetail: {
                    include: {
                        serviceDetails: true
                    }
                }
            }
        });
    }

    async getByCompanyId(companyId: string) {
        return await this.prisma.appointment.findMany({
            where: {
                AppointmentDetail: {
                    some: {
                        serviceDetails: {
                            some: {
                                employee: {
                                    companyId
                                }
                            }
                        }
                    }
                }
            },
            include: {
                AppointmentDetail: {
                    include: {
                        serviceDetails: true
                    }
                }
            }
        });
    }

    async getByEmployeeId(employeeId: string) {
        return await this.prisma.appointment.findMany({
            where: {
                AppointmentDetail: {
                    some: {
                        serviceDetails: {
                            some: {
                                employeeId
                            }
                        }
                    }
                }
            },
            include: {
                AppointmentDetail: {
                    include: {
                        serviceDetails: true
                    }
                }
            }
        });
    }

    async createAppointment(userId: string, appointmentRequestModel: AppointmentRequestModel) {
        let status = AppointmentStatus.Pending;
        let appointmentStatus = status.toString();

        const appointment = await this.prisma.appointment.create({
            data: {
                appointmentStatus,
                totalDuration: 0,
                totalPrice: 0,
                users: {
                    connect: {
                        id: userId
                    }
                }
            }
        });

        await this.appointmentDetailService.createAppointmentDetails(appointment.id,
            appointmentRequestModel.appointmentDetails);


        return appointment;
    }
}
