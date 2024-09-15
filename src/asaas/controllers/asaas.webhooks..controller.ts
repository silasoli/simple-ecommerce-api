import { Controller, Post, Body, Req, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AsaasWebhooksService } from '../services/asaas.webhooks.service';
import { PaymentWebook } from '../types/webhooks/webhook.types';

@ApiTags('webhooks')
@Controller('webhooks')
export class AsaasWebhooksController {
  constructor(private readonly asaasWebhooksService: AsaasWebhooksService) {}

  @Post('payment-confirmed')
  create(
    @Req() req: any,
    @Headers('authorization') authorization: string,
    @Headers('asaas-access-token') asaasAc: string,
    @Body() dto: PaymentWebook,
  ): Promise<void> {
    console.log(req)
    console.log(`authorization`, authorization)
    console.log(`asaas-access-token`, asaasAc)
    return this.asaasWebhooksService.paymentConfirmed(dto);
  }
}
