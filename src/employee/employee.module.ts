import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ServiceDetailsService } from 'src/service-details/service-details.service';
import { LoggerService } from 'src/utils';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, AuthService, ServiceDetailsService, LoggerService],
  imports: [AuthModule, JwtModule.register({})]
})
export class EmployeeModule { }
