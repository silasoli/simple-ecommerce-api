import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { PublicOrdersController } from './controllers/public-orders.controller';
import { ProductsModule } from '../products/products.module';
import { Orders } from '../database/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './controllers/orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), ProductsModule],
  controllers: [OrdersController, PublicOrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
