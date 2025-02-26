import { Controller, Get, Param } from '@nestjs/common';
import { ConstantService } from './constant.service';

@Controller('constant')
export class ConstantController {
  constructor(private constantService: ConstantService) {}

  @Get('/countries')
  getCountries() {
    return this.constantService.getCountries();
  }

  @Get(':countryId/cities')
  getCities(@Param('countryId') countryId: string) {
    return this.constantService.getCities(countryId);
  }

  @Get(':cityId/districts')
  getDistricts(@Param('cityId') cityId: string) {
    return this.constantService.getDistricts(cityId);
  }
}
