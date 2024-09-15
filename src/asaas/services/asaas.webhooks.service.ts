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


  // public async validateAndExecuteInvoiceReleased(
  //   authorization: string,
  //   domain: string,
  //   body: InvoiceReleased,
  // ) {
  //   await this.validAuthorization(authorization, domain);

  //   return this.invoiceReleased(domain, body);
  // }

  // private async validAuthorization(
  //   authorization: string,
  //   domain: string,
  // ): Promise<void> {
  //   const secrets = await this.gatewaySecretManager.fromDomain(domain);

  //   if (secrets.acquirer_iugu_v1_web_hook_auth !== authorization)
  //     throw new UnauthorizedException('INVALID CREDENTIALS');
  // }
}
