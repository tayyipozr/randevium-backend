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
      const appointment = await this.prisma.appointment.create({
        data: {
          totalDuration: 0,
          totalPrice: 0,
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });

      await this.appointmentDetailService.createAppointmentDetails(
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

      const user = await this.prisma.user.findFirst({
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

      const userIds = serviceDetails.map((e) => e.employee.userId);

      const users = await this.prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });

      if (users.length > 0) {
        users.forEach((u) => {
          if (!!user.token) {
            const userServiceDetails = serviceDetails.filter(
              (service) => service.employee.userId === u.id,
            );

            userServiceDetails.forEach((serviceDetail) => {
              const message = `${user?.firstName ?? '-'} ${user?.lastName ?? '-'} ${serviceDetail?.service?.name ?? '-'} hizmeti için bir randevu oluşturdu.`;

              this.firebase.sendNotification(
                user.token,
                'Randevu Oluşturuldu',
                message,
                appointment.id,
              );
            });
          }
        });
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
}
