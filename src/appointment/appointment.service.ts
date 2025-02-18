import { ConflictException, Injectable } from '@nestjs/common';
import { AppointmentRequestModel } from './model/appointment-request.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentDetailService } from 'src/appointment-detail/appointment-detail.service';
import { checkIfAppointmentDateTimeAfterToday } from 'src/appointment-detail/business';
import { LoggerService } from 'src/utils';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appointmentDetailService: AppointmentDetailService,
    private readonly logger: LoggerService,
    private readonly firebase: FirebaseService,
  ) {}

  async getByAppoinmentId(appointmentId: string) {
    this.logger.log(
      `Fetching appointment for appointmentId: ${appointmentId}`,
      'AppointmentService',
    );
    return await this.prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        appointmentDetail: {
          include: {
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
        },
      },
    });
  }

  async getByUserId(userId: string) {
    this.logger.log(
      `Fetching appointments for user: ${userId}`,
      'AppointmentService',
    );
    return await this.prisma.appointment.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },

      include: {
        appointmentDetail: {
          include: {
            serviceDetails: true,
          },
          orderBy: {
            appointmentDateTime: 'asc',
          },
        },
      },
    });
  }

  async getByCompanyId(companyId: string) {
    this.logger.log(
      `Fetching appointments for company: ${companyId}`,
      'AppointmentService',
    );
    return await this.prisma.appointment.findMany({
      where: {
        appointmentDetail: {
          some: {
            serviceDetails: {
              some: {
                employee: {
                  companyId,
                },
              },
            },
          },
        },
      },
      include: {
        appointmentDetail: {
          include: {
            serviceDetails: true,
          },
          orderBy: {
            appointmentDateTime: 'asc',
          },
        },
      },
    });
  }

  async getByEmployeeId(employeeId: string) {
    return await this.prisma.appointment.findMany({
      where: {
        appointmentDetail: {
          some: {
            serviceDetails: {
              some: {
                employeeId,
              },
            },
          },
        },
      },
      include: {
        appointmentDetail: {
          include: {
            serviceDetails: true,
          },
          orderBy: {
            appointmentDateTime: 'asc',
          },
        },
      },
    });
  }

  async createAppointment(
    userId: string,
    appointmentRequestModel: AppointmentRequestModel,
  ) {
    this.logger.log(
      `Creating new appointment for user: ${userId}`,
      'AppointmentService',
    );

    if (
      !appointmentRequestModel.appointmentDetails.every((e) =>
        checkIfAppointmentDateTimeAfterToday(e.appointmentDateTime),
      )
    ) {
      this.logger.warn(
        `Invalid appointment date attempted for user: ${userId}`,
        'AppointmentService',
      );
      throw new ConflictException(
        'Daha önceki tarihler için randevu oluşturulamaz.',
      );
    }

    try {
      const userIds = appointmentRequestModel.userIds;
      userIds.push(userId);

      const appointment = await this.prisma.appointment.create({
        data: {
          creatorUserId: userId,
          totalDuration: 0,
          totalPrice: 0,
          users: {
            connect: userIds.map((id) => ({ id })),
          },
        },
      });

      await this.appointmentDetailService.createAppointmentDetails(
        userId,
        appointment.id,
        appointmentRequestModel.appointmentDetails,
      );

      this.logger.log(
        `Successfully created appointment: ${appointment.id}`,
        'AppointmentService',
      );

      const serviceIds = appointmentRequestModel.appointmentDetails.map((e) =>
        e.serviceDetails.join(', '),
      );

      try {
        await this.sendNotificationToEmployee(
          appointment.id,
          serviceIds,
          userId,
          userIds,
          false,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send notification to user: ${userId}`,
          error.stack,
          'AppointmentService',
        );
      }

      return appointment;
    } catch (error) {
      this.logger.error(
        `Failed to create appointment for user: ${userId}`,
        error.stack,
        'AppointmentService',
      );
      throw error;
    }
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
              'Randevu Oluşturuldu',
              message,
              appointmentId,
            );
          });
        }
      });
    }
  }

  async cancelAppointment(userId: string, appointmentId: string) {
    this.logger.log(
      `cancel appointment for user: ${userId} and appointmentId: ${appointmentId}`,
      'AppointmentService',
    );

    const appointment = await this.prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        appointmentDetail: {
          include: {
            serviceDetails: true,
          },
        },
      },
    });

    const appointmentDetailIds = appointment.appointmentDetail.map((e) => e.id);

    const updatedAppointment = await this.prisma.appointmentDetail.updateMany({
      where: {
        id: {
          in: appointmentDetailIds,
        },
      },
      data: {
        appointmentStatus: '2',
      },
    });

    const serviceIds = appointment.appointmentDetail.map((e) =>
      e.serviceDetails.join(', '),
    );

    await this.sendNotificationToEmployee(
      appointment.id,
      serviceIds,
      userId,
      [],
      false,
    );

    return updatedAppointment;
  }
}
