import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AsaasCustomersService } from './services/asaas.customers.service';
import { AsaasPaymentsService } from './services/asaas.payments.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [AsaasCustomersService, AsaasPaymentsService],
  exports: [AsaasCustomersService, AsaasPaymentsService]
})
export class AsaasModule {}
