import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { LoggerModule } from 'src/utils/logger/logger.module';
import { DragonflyModule } from 'src/dragonfly/dragonfly.module';

@Module({
  imports: [LoggerModule, DragonflyModule],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule { }
