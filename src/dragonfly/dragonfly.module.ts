import { Global, Module } from '@nestjs/common';
import { DragonflyService } from './dragonfly.service';

@Global()
@Module({
  providers: [DragonflyService],
  exports: [DragonflyService]
})
export class DragonflyModule { }
