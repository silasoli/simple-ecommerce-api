import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { PublicOrdersController } from './controllers/public-orders.controller';
import { ProductsModule } from '../products/products.module';
import { Orders } from '../database/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './controllers/orders.controller';
import { CustomersModule } from '../customers/customers.module';
import { InstallmentsService } from './services/installments.service';
import { ShippingModule } from '../shipping/shipping.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders]),
    ProductsModule,
    CustomersModule,
    ShippingModule,
  ],
  controllers: [OrdersController, PublicOrdersController],
  providers: [OrdersService, InstallmentsService],
  exports: [OrdersService],
})
export class OrdersModule {}
