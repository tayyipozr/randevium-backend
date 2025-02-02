import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { AppointmentRequestModel } from './model/appointment-request.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentStatus } from './enum';
import { AppointmentDetailService } from 'src/appointment-detail/appointment-detail.service';
import { checkIfAppointmentDateTimeAfterToday } from 'src/appointment-detail/business';
import { LoggerService } from 'src/utils';

@Injectable()
export class AppointmentService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly appointmentDetailService: AppointmentDetailService,
        private readonly logger: LoggerService
    ) { }

    async getByUserId(userId: string) {
        this.logger.log(`Fetching appointments for user: ${userId}`, 'AppointmentService');
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
        this.logger.log(`Fetching appointments for company: ${companyId}`, 'AppointmentService');
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
        this.logger.log(`Creating new appointment for user: ${userId}`, 'AppointmentService');

        if (!appointmentRequestModel.appointmentDetails.every(e => checkIfAppointmentDateTimeAfterToday(e.appointmentDateTime))) {
            this.logger.warn(`Invalid appointment date attempted for user: ${userId}`, 'AppointmentService');
            throw new ConflictException("Daha önceki tarihler için randevu oluşturulamaz.");
        }

        try {
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

            await this.appointmentDetailService.createAppointmentDetails(
                appointment.id,
                appointmentRequestModel.appointmentDetails
            );

            this.logger.log(`Successfully created appointment: ${appointment.id}`, 'AppointmentService');
            return appointment;
        } catch (error) {
            this.logger.error(
                `Failed to create appointment for user: ${userId}`,
                error.stack,
                'AppointmentService'
            );
            throw error;
        }
    }
}
