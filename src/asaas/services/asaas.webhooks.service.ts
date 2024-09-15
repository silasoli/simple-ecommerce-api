import { Injectable, Logger } from '@nestjs/common';
import { PaymentWebook } from '../types/webhooks/webhook.types';

@Injectable()
export class AsaasWebhooksService {
  private readonly logger = new Logger(AsaasWebhooksService.name);

  public async paymentConfirmed(data: PaymentWebook) {
    this.logger.log('INICIANDO WEBHOOK - EVENTO: PAYMENT_CONFIRMED');
    this.logger.log(`DATA: ${data}`);

    await this.handlerPaymentConfirmed(data);

    this.logger.log('FINALIZANDO WEBHOOK - EVENTO: PAYMENT_CONFIRMED');
  }

  private async handlerPaymentConfirmed(data: PaymentWebook) {
    if (data.event != 'PAYMENT_CONFIRMED')
      return this.logger.log('EVENTO INVALIDO');
  }
}
