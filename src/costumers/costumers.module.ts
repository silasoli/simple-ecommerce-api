import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Costumers } from '../database/entities/costumer.entity';
import { Address } from '../database/entities/address.entity';
import { CostumersService } from './services/costumers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Costumers, Address])],
  providers: [CostumersService],
})
export class CostumersModule {}
