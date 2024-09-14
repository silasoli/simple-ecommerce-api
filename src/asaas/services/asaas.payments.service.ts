import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  BillingType,
  CreateChargeAsaasDto,
} from '../dto/payments/create-charge-asaas.dto';
import { CreateChargeAsaasResponse } from '../types/payments/CreateChargeAsaasResponse.types';
import {
  ChargeAsaasResponse,
  DigitableBillAsaasResponse,
  PixQrCodeAsaasResponse,
} from '../types/payments/ChargeAsaasResponse.types';
import {
  CreateChargeCardAsaasDto,
  CreditCardTokenizeAsaasDto,
} from '../dto/payments/credit-card-asaas.dto';
import { CreditCardTokenizeAsaasResponse } from '../types/payments/CreditCardAsaasResponse.types';

@Injectable()
export class AsaasPaymentsService {
  private ASAAS_URL = `${process.env.ASAAS_URL}`;
  private ASAAS_AUTH = process.env.ASAAS_AUTH;

  constructor(private readonly httpService: HttpService) {}

  public async createCharge(
    dto: CreateChargeAsaasDto,
  ): Promise<CreateChargeAsaasResponse> {
    const URL = `${this.ASAAS_URL}/payments`;

    // try {
    const response = await this.httpService.axiosRef.post(
      URL,
      {
        ...dto,
      },
      {
        headers: {
          access_token: this.ASAAS_AUTH,
        },
      },
    );

    // if (dto.billingType === BillingType.PIX) {
    //   const qrcode = await this.getpixQRCode(response.data.id);
    //   return { ...response.data, ...qrcode };
    // }

    // if (dto.billingType === BillingType.BOLETO) {
    //   const invoice = await this.getInvoiceDigitableBill(response.data.id);
    //   return { ...response.data, ...invoice };
    // }
    return response.data;
    // } catch (error) {
    // console.log(error)
    // console.log(error.response.data);
    // }
  }

  public async findOneCharge(id: string): Promise<ChargeAsaasResponse> {
    const URL = `${this.ASAAS_URL}/payments/${id}`;

    const response = await this.httpService.axiosRef.get(URL, {
      headers: {
        access_token: this.ASAAS_AUTH,
      },
    });

    return response.data;
  }

  private async creditCardTokenize(
    dto: CreditCardTokenizeAsaasDto,
  ): Promise<CreditCardTokenizeAsaasResponse> {
    const URL = `${this.ASAAS_URL}/creditCard/tokenize`;

    const response = await this.httpService.axiosRef.post(
      URL,
      {
        ...dto,
      },
      {
        headers: {
          access_token: this.ASAAS_AUTH,
        },
      },
    );

    return response.data;
  }

  public async creditCard(
    dto: CreateChargeCardAsaasDto,
    card: CreditCardTokenizeAsaasDto,
  ): Promise<CreateChargeAsaasResponse> {
    const token = await this.creditCardTokenize(card);

    const URL = `${this.ASAAS_URL}/payments`;

    const response = await this.httpService.axiosRef.post(
      URL,
      {
        ...dto,
        creditCardToken: token.creditCardToken,
        authorizeOnly: false,
        billingType: BillingType.CREDIT_CARD,
      },
      {
        headers: {
          access_token: this.ASAAS_AUTH,
        },
      },
    );

    return response.data;
  }

  public async getInvoiceDigitableBill(
    id: string,
  ): Promise<DigitableBillAsaasResponse> {
    const URL = `${this.ASAAS_URL}/payments/${id}/identificationField`;

    const response = await this.httpService.axiosRef.get(URL, {
      headers: {
        access_token: this.ASAAS_AUTH,
      },
    });

    return response.data;
  }

  public async getpixQRCode(id: string): Promise<PixQrCodeAsaasResponse> {
    const URL = `${this.ASAAS_URL}/payments/${id}/pixQrCode`;

    const response = await this.httpService.axiosRef.get(URL, {
      headers: {
        access_token: this.ASAAS_AUTH,
      },
    });

    return response.data;
  }
}
