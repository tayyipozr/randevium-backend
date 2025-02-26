import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { LoggerModule } from 'src/utils';

@Module({
  imports: [LoggerModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
