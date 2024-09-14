import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { PublicOrdersController } from './controllers/orders.controller';
import { ProductsModule } from '../products/products.module';
import { Orders } from '../database/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), ProductsModule],
  controllers: [PublicOrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
