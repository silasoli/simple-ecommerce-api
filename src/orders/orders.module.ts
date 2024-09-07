import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { PublicOrdersController } from './controllers/orders.controller';

@Module({
  controllers: [PublicOrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
