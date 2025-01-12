import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentDetailRequestModel } from './model/appointment-detail-request-model';

@Injectable()
export class AppointmentDetailService {
    constructor(private readonly prisma: PrismaService) { }

    async getByUserId(userId: string) {
        return await this.prisma.appointmentDetail.findMany({
            where: {
                appointment: {
                    users: {
                        some: {
                            id: userId
                        }
                    }
                }
            },
            include: {
                serviceDetails: {
                    include: {
                        employee: {
                            select: {
                                company: {
                                    select: {
                                        name: true,
                                        phoneNumber: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    async getByCompanyId(companyId: string) {
        return await this.prisma.appointmentDetail.findMany({
            where: {
                serviceDetails: {
                    some: {
                        employee: {
                            companyId
                        }
                    }
                }
            },
            include: {
                serviceDetails: {
                    include: {
                        employee: {
                            select: {
                                company: {
                                    select: {
                                        name: true,
                                        phoneNumber: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    async getByEmployeeId(employeeId: string) {
        return await this.prisma.appointmentDetail.findMany({
            where: {
                serviceDetails: {
                    some: {
                        employeeId
                    }
                }
            },
            include: {
                serviceDetails: {
                    include: {
                        employee: {
                            select: {
                                company: {
                                    select: {
                                        name: true,
                                        phoneNumber: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    async createAppointmentDetails(appointmentId: string, models: AppointmentDetailRequestModel[]): Promise<string[]> {
        let appointmentDetails: string[] = [];
        for (var i = 0; i < models.length; i++) {
            var appointmentDetail = await this.prisma.appointmentDetail.create({
                data: {
                    appointmentDateTime: models[i].appointmentDateTime,
                    appointmentId: appointmentId,
                    serviceDetails: {
                        connect: models[i].serviceDetails.map(id => ({ id }))
                    }
                }
            });
            appointmentDetails.push(appointmentDetail.id);
        }

        return appointmentDetails;
    }



    private mapRequestModeltoPrismaModel(appointmentId: string, models: AppointmentDetailRequestModel[]) {
        return models.map(item =>
            item.serviceDetails.map(sItem => {
                return {
                    appointmentDateTime: item.appointmentDateTime,
                    appointmentId,
                    connect: {
                        id: sItem
                    }
                }
            })
        );
    }
}