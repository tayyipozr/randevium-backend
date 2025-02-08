import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enum';
import { CategoryService } from './category.service';
import { CategoryRequestModel, CategoryUpdateModel } from './model';

@Controller('category')
@Roles(Role.Admin)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Post()
  createCategories(@Body() model: CategoryRequestModel) {
    return this.categoryService.createCategories(model);
  }

  @Put(':id')
  updateCategory(@Param('id') id: string, @Body() model: CategoryUpdateModel) {
    return this.categoryService.updateCategory(id, model);
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
