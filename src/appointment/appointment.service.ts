import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { AppointmentRequestModel } from './model/appointment-request.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentStatus } from './enum';
import { AppointmentDetailService } from 'src/appointment-detail/appointment-detail.service';
import { checkIfAppointmentDateTimeAfterToday } from 'src/appointment-detail/business';

@Injectable()
export class AppointmentService {
    constructor(private readonly prisma: PrismaService,
        private readonly appointmentDetailService: AppointmentDetailService
    ) { }

    async getByUserId(userId: string) {
        return await this.prisma.appointment.findMany({
            where: {
                users: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                appointmentDetail: {
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
                appointmentDetail: {
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
                appointmentDetail: {
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
                appointmentDetail: {
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
                appointmentDetail: {
                    include: {
                        serviceDetails: true
                    }
                }
            }
        });
    }

    async createAppointment(userId: string, appointmentRequestModel: AppointmentRequestModel) {
        if (!appointmentRequestModel.appointmentDetails.every(e => checkIfAppointmentDateTimeAfterToday(e.appointmentDateTime)))
            throw new ConflictException("Daha önceki tarihler için randevu oluşturulamaz.");

        const appointment = await this.prisma.appointment.create({
            data: {
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
