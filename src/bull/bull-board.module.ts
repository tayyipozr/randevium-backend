import { Module, OnModuleInit } from '@nestjs/common';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Module({})
export class BullBoardModule implements OnModuleInit {
  constructor(
    @InjectQueue('notificationQueue') private notificationQueue: Queue,
  ) {}

  onModuleInit() {
    const serverAdapter = new ExpressAdapter();

    // ⚠️ Burayı, sizin kullandığınız yola göre düzenleyin:
    serverAdapter.setBasePath('/v1/api/bull-dashboard');

    createBullBoard({
      queues: [new BullAdapter(this.notificationQueue)],
      serverAdapter,
    });

    const app = (global as any).expressApp;
    app.use('/v1/api/bull-dashboard', serverAdapter.getRouter());
  }
}
