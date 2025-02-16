import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentDetailRequestModel } from './model/appointment-detail-request-model';
import { LoggerService } from 'src/utils';

@Injectable()
export class AppointmentDetailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getByAppoinmentDetailId(appointmentDetailId: string) {
    this.logger.log(
      `Fetching appointment details for appointmentDetailId: ${appointmentDetailId}`,
      'AppointmentDetailService',
    );
    return await this.prisma.appointmentDetail.findUnique({
      where: {
        id: appointmentDetailId,
      },
      include: {
        appointment: true,
        serviceDetails: {
          include: {
            employee: {
              select: {
                company: {
                  select: {
                    name: true,
                    phoneNumber: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getByUserId(userId: string) {
    this.logger.log(
      `Fetching appointment details for user: ${userId}`,
      'AppointmentDetailService',
    );
    return await this.prisma.appointmentDetail.findMany({
      where: {
        appointment: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
      include: {
        appointment: true,
        serviceDetails: {
          include: {
            service: true,
            employee: {
              select: {
                company: {
                  select: {
                    name: true,
                    phoneNumber: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getByCompanyId(companyId: string) {
    return await this.prisma.appointmentDetail.findMany({
      where: {
        serviceDetails: {
          some: {
            employee: {
              companyId,
            },
          },
        },
      },
      include: {
        appointment: true,
        serviceDetails: {
          include: {
            employee: {
              select: {
                company: {
                  select: {
                    name: true,
                    phoneNumber: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getByEmployeeId(employeeId: string) {
    return await this.prisma.appointmentDetail.findMany({
      where: {
        serviceDetails: {
          some: {
            employeeId,
          },
        },
      },
      orderBy: {
        appointmentDateTime: 'desc',
      },
      include: {
        appointment: {
          include: {
            users: true,
          },
        },
        serviceDetails: {
          include: {
            employee: {
              select: {
                user: true,
                company: {
                  select: {
                    name: true,
                    phoneNumber: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async createAppointmentDetails(
    userId: string,
    appointmentId: string,
    models: AppointmentDetailRequestModel[],
  ): Promise<string[]> {
    this.logger.log(
      `Creating appointment details for appointment: ${appointmentId}`,
      'AppointmentDetailService',
    );

    try {
      const appointmentDetails: string[] = [];
      for (let i = 0; i < models.length; i++) {
        const appointmentDetail = await this.prisma.appointmentDetail.create({
          data: {
            creatorUserId: userId,
            appointmentDateTime: new Date(
              models[i].appointmentDateTime,
            ).toISOString(),
            appointmentId: appointmentId,
            serviceDetails: {
              connect: models[i].serviceDetails.map((id) => ({ id })),
            },
          },
        });
        appointmentDetails.push(appointmentDetail.id);
      }

      this.logger.log(
        `Successfully created ${appointmentDetails.length} appointment details`,
        'AppointmentDetailService',
      );
      return appointmentDetails;
    } catch (error) {
      this.logger.error(
        `Failed to create appointment details for appointment: ${appointmentId}`,
        error.stack,
        'AppointmentDetailService',
      );
      throw error;
    }
  }

  private mapRequestModeltoPrismaModel(
    appointmentId: string,
    models: AppointmentDetailRequestModel[],
  ) {
    return models.map((item) =>
      item.serviceDetails.map((sItem) => {
        return {
          appointmentDateTime: item.appointmentDateTime,
          appointmentId,
          connect: {
            id: sItem,
          },
        };
      }),
    );
  }
}
