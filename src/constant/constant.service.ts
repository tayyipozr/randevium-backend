import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/utils/logger/logger.service';

@Injectable()
export class ConstantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getCountries() {
    this.logger.log(`getCountries`, 'EmployeeService');
    return await this.prisma.country.findMany();
  }

  async getCities(countryId: string) {
    this.logger.log(`Fetching cities`, 'EmployeeService');
    return await this.prisma.city.findMany({
      where: {
        countryId: countryId,
      },
    });
  }

  async getDistricts(cityId: string) {
    this.logger.log(`Fetching district`, 'EmployeeService');
    return await this.prisma.district.findMany({
      where: {
        cityId: cityId,
      },
    });
  }
}
