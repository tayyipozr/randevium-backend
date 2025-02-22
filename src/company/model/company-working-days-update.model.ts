import { ApiProperty } from '@nestjs/swagger';
import { WorkingCompanyDays } from '@prisma/client';
import { IsArray } from 'class-validator';

export class CompanyWorkingDaysUpdateModel {
  @IsArray()
  @ApiProperty()
  workingDays?: WorkingCompanyDays[];
}
