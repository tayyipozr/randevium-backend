import { ApiProperty } from '@nestjs/swagger';
import { WorkingEmployeeDays } from '@prisma/client';
import { IsArray } from 'class-validator';

export class EmployeeWorkingDaysUpdateModel {
  @IsArray()
  @ApiProperty()
  workingDays?: WorkingEmployeeDays[];
}
