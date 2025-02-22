import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EmployeeRequestModel,
  EmployeeUpdateModel,
  UserEmployeeRequestModel,
} from './model';
import { AuthService } from 'src/auth/auth.service';
import { randomBytes } from 'crypto';
import { AuthSignUpRequest } from 'src/auth/dto';
import { Role } from 'src/auth/enum';
import { LoggerService } from 'src/utils';
import { EmployeeWorkingDaysUpdateModel } from './model/employee-working-days-update.model';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {}

  async getEmployees(companyId: string) {
    this.logger.log(
      `Fetching employees for company: ${companyId}`,
      'EmployeeService',
    );
    return await this.prisma.employee.findMany({
      where: {
        companyId,
      },
      include: {
        serviceDetails: {
          select: {
            id: true,
            duration: true,
            cost: true,
            canBeGroup: true,
            isRecurred: true,
            service: true,
          },
        },
        company: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            updatedAt: true,
            images: true,
          },
        },
        employeeSettings: {
          include: {
            workingDays: true,
          },
        },
      },
    });
  }

  async getEmployeeWorkingDays(employeeSettingsId: string) {
    this.logger.log(
      `getEmployeeWorkingHours: ${employeeSettingsId}`,
      'EmployeeService',
    );
    return await this.prisma.workingEmployeeDays.findMany({
      where: {
        employeeSettingsId: employeeSettingsId,
      },
    });
  }

  async updateEmployeeWorkingDays(
    employeeSettingsId: string,
    model: EmployeeWorkingDaysUpdateModel,
  ) {
    this.logger.log(
      `updateEmployeeWorkingDays: ${model.workingDays}`,
      'EmployeeService',
    );

    const newWorkingDays = model.workingDays.filter((day) => !day.id);

    const existingWorkingDays = model.workingDays.filter((day) => !!day.id);

    await Promise.all(
      existingWorkingDays.map((day) =>
        this.prisma.workingEmployeeDays.update({
          where: { id: day.id },
          data: {
            startTime: day.startTime,
            endTime: day.endTime,
            status: day.status,
          },
        }),
      ),
    );

    if (newWorkingDays.length > 0) {
      await Promise.all(
        newWorkingDays.map((day) =>
          this.prisma.workingEmployeeDays.create({
            data: {
              day: day.day,
              startTime: day.startTime,
              endTime: day.endTime,
              status: day.status,
              employeeSettingsId: employeeSettingsId,
            },
          }),
        ),
      );
    }

    return 'Başarılı';
  }

  //TODO: Write a function that returns code for signing up employee to company

  async createEmployee(model: EmployeeRequestModel) {
    this.logger.log(
      `Creating new employee for company: ${model.companyId}`,
      'EmployeeService',
    );

    try {
      let user = await this.getUser(model.user.phoneNumber);

      if (!user) {
        this.logger.log(
          `Creating new user for employee: ${model.user.phoneNumber}`,
          'EmployeeService',
        );
        const password = randomBytes(8).toString('base64').slice(0, 8);
        const singUpUser = this.maptoSingUpUserModel(model.user, password);
        await this.authService.signup(singUpUser);
        user = await this.getUser(model.user.phoneNumber);

        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            roles: {
              connect: { name: Role.CompanyEmployee },
            },
          },
        });
        this.logger.log(
          `User created and role assigned: ${user.id}`,
          'EmployeeService',
        );
      }

      let employee = await this.prisma.employee.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (employee !== null && employee.companyId != null) {
        throw new NotFoundException('Çalışan zaten bir şirkete kayıtlı!');
      }

      if (employee) {
        employee = await this.prisma.employee.update({
          where: {
            id: employee.id,
          },
          data: {
            description: model.description,
            companyId: model.companyId,
            userId: user.id,
          },
        });
      } else {
        employee = await this.prisma.employee.create({
          data: {
            description: model.description,
            companyId: model.companyId,
            userId: user.id,
          },
        });
      }

      if (model.serviceDetails && model.serviceDetails.length > 0) {
        await this.prisma.serviceDetails.createMany({
          data: model.serviceDetails,
        });
      }

      this.logger.log(
        `Employee created successfully: ${employee.id}`,
        'EmployeeService',
      );
      return employee;
    } catch (error) {
      this.logger.error(
        `Failed to create employee for company: ${model.companyId}`,
        error.stack,
        'EmployeeService',
      );
      throw error;
    }
  }

  private maptoSingUpUserModel(
    userInfo: UserEmployeeRequestModel,
    password: string,
  ): AuthSignUpRequest {
    const singUpUser = new AuthSignUpRequest();
    singUpUser.email = userInfo.email;
    singUpUser.firstName = userInfo.firstName;
    singUpUser.lastName = userInfo.lastName;
    singUpUser.gender = userInfo.gender;
    singUpUser.phoneNumber = userInfo.phoneNumber;
    singUpUser.password = password;
    return singUpUser;
  }

  private async getUser(phoneNumber: string) {
    return await this.prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    });
  }

  async updateEmployeeCompany(id: string, companyId: string) {
    this.logger.log(
      `update company ${companyId} employee: ${id}`,
      'EmployeeService',
    );
    try {
      const result = await this.prisma.employee.update({
        where: {
          id,
        },
        data: {
          companyId,
        },
      });
      this.logger.log(
        `Employee company updated successfully: ${id}`,
        'EmployeeService',
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update company employee: ${id}`,
        error.stack,
        'EmployeeService',
      );
      throw error;
    }
  }

  async deleteEmployee(id: string) {
    this.logger.log(`Deleting employee: ${id}`, 'EmployeeService');
    try {
      const result = await this.prisma.employee.delete({
        where: {
          id,
        },
      });
      this.logger.log(
        `Employee deleted successfully: ${id}`,
        'EmployeeService',
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to delete employee: ${id}`,
        error.stack,
        'EmployeeService',
      );
      throw error;
    }
  }

  async updateEmployee(id: string, model: EmployeeUpdateModel) {
    this.logger.log(`Updating employee: ${id}`, 'EmployeeService');
    try {
      const updateData: any = {};

      if (model.description !== undefined)
        updateData.description = model.description;
      if (model.companyId !== undefined) updateData.companyId = model.companyId;

      const result = await this.prisma.employee.update({
        where: {
          id: id,
        },
        data: updateData,
        include: {
          company: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      this.logger.log(
        `Employee updated successfully: ${id}`,
        'EmployeeService',
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update employee: ${id}`,
        error.stack,
        'EmployeeService',
      );
      throw error;
    }
  }
}
