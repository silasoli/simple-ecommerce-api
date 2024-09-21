import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../database/entities/address.entity';
import { CustomersService } from './services/customers.service';
import { Customers } from '../database/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customers, Address])],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
