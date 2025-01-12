import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ServiceDetailsService } from 'src/service-details/service-details.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, AuthService, ServiceDetailsService],
  imports: [AuthModule, JwtModule.register({})]
})
export class EmployeeModule {}
