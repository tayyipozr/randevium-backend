import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentDetailRequestModel } from './model/appointment-detail-request-model';
import { LoggerService } from 'src/utils';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AppointmentDetailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly firebase: FirebaseService,
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
      orderBy: {
        appointmentDateTime: 'asc',
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
      orderBy: {
        appointmentDateTime: 'asc',
      },
      include: {
        appointment: {
          include: {
            appointmentDetail: {
              orderBy: {
                appointmentDateTime: 'asc',
              },
              include: {
                serviceDetails: true,
              },
            },
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
        appointmentDateTime: 'asc',
      },
      include: {
        appointment: {
          include: {
            appointmentDetail: {
              orderBy: {
                appointmentDateTime: 'asc',
              },
              include: {
                serviceDetails: true,
              },
            },
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
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
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

        const serviceDetails = await this.prisma.serviceDetails.findMany({
          where: {
            id: {
              in: models[i].serviceDetails,
            },
          },
          include: {
            service: true,
            employee: {
              include: {
                company: true,
              },
            },
          },
        });

        const message = `${serviceDetails.map((e) => e.service.name).join(', ')} ${serviceDetails.length > 1 ? 'hizmetleri' : 'hizmeti'} için ${serviceDetails[0].employee.company.name} işletmesinde`;

        this.firebase.scheduleReminders(
          new Date(models[i].appointmentDateTime),
          user.token,
          message,
        );

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

  async updatePaymentStatus(
    appoinmentDetailId: string,
    hasPaymentMade: boolean,
  ) {
    this.logger.log(
      `Updating payment status for appointmentDetailId: ${appoinmentDetailId}, hasPaymentMade: ${hasPaymentMade}`,
      'AppointmentDetailService',
    );

    try {
      const updatedAppointmentDetail =
        await this.prisma.appointmentDetail.update({
          where: { id: appoinmentDetailId },
          data: { hasPaymentMade },
        });

      this.logger.log(
        `Successfully updated payment status for appointmentDetailId: ${appoinmentDetailId}`,
        'AppointmentDetailService',
      );
      return updatedAppointmentDetail;
    } catch (error) {
      this.logger.error(
        `Failed to update payment status for appointmentDetailId: ${appoinmentDetailId}`,
        error.stack,
        'AppointmentDetailService',
      );
      throw error;
    }
  }

  async cancelAppointmentDetail(userId: string, appointmentDetailId: string) {
    this.logger.log(
      `cancel appointment detail for user: ${userId} and appointmentId: ${appointmentDetailId}`,
      'AppointmentDetailService',
    );

    const appointmentDetail = await this.prisma.appointmentDetail.findUnique({
      where: {
        id: appointmentDetailId,
      },
      include: {
        serviceDetails: true,
      },
    });

    if (!appointmentDetail) {
      throw new NotFoundException('Randevu bulunamadı');
    }

    const updatedAppointment = await this.prisma.appointmentDetail.update({
      where: {
        id: appointmentDetailId,
      },
      data: {
        appointmentStatus: '2',
      },
    });

    const serviceIds = appointmentDetail.serviceDetails.map((e) => e.id);

    await this.sendNotificationToEmployee(
      appointmentDetail.appointmentId,
      serviceIds,
      userId,
      [],
      true,
    );

    return updatedAppointment;
  }

  async sendNotificationToEmployee(
    appointmentId: string,
    serviceIds: string[],
    userId: string,
    userIds: string[],
    isCancel: boolean,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const serviceDetails = await this.prisma.serviceDetails.findMany({
      where: {
        id: {
          in: serviceIds,
        },
      },
      include: {
        employee: true,
        service: true,
      },
    });

    const employeeUserIds = serviceDetails.map((e) => e.employee.userId);

    const employeeUsers = await this.prisma.user.findMany({
      where: {
        id: {
          in: employeeUserIds,
        },
      },
    });

    if (employeeUsers.length > 0) {
      employeeUsers.forEach((u) => {
        if (!!user.token) {
          const userServiceDetails = serviceDetails.filter(
            (service) => service.employee.userId === u.id,
          );

          userServiceDetails.forEach((serviceDetail) => {
            let message = `${user?.firstName ?? '-'} ${user?.lastName ?? '-'} ${serviceDetail?.service?.name ?? '-'} hizmeti için ${userIds.length > 1 ? 'birden çok katılımcılı ' : ''}bir randevu oluşturdu.`;

            if (!!isCancel) {
              message = `${user?.firstName ?? '-'} ${user?.lastName ?? '-'} ${serviceDetail?.service?.name ?? '-'} hizmeti için randevusunu iptal etti.`;
            }

            this.firebase.sendNotification(
              user.token,
              !!isCancel ? 'Randevu İptal Edildi' : 'Randevu Oluşturuldu',
              message,
              appointmentId,
            );
          });
        }
      });
    }
  }
}
