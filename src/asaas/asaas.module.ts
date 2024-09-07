import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AsaasCustomersService } from './services/asaas.customers.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [AsaasCustomersService],
  exports: [AsaasCustomersService]
})
export class AsaasModule {}
