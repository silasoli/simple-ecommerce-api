import { HttpException, Injectable } from '@nestjs/common';
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

    try {
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
    } catch (error) {
      const statusCode = error.response.status;
      const errors = error.response.data.errors[0];
      throw new HttpException({ ...errors }, statusCode);
    }
  }

  public async findOneCharge(id: string): Promise<ChargeAsaasResponse> {
    const URL = `${this.ASAAS_URL}/payments/${id}`;

    try {
      const response = await this.httpService.axiosRef.get(URL, {
        headers: {
          access_token: this.ASAAS_AUTH,
        },
      });

      return response.data;
    } catch (error) {
      const statusCode = error.response.status;
      const errors = error.response.data.errors[0];
      throw new HttpException({ ...errors }, statusCode);
    }
  }

  private async creditCardTokenize(
    dto: CreditCardTokenizeAsaasDto,
  ): Promise<CreditCardTokenizeAsaasResponse> {
    const data = {
      ...dto,
      creditCardHolderInfo: {
        name: dto.creditCardHolderInfo.name,
        email: dto.creditCardHolderInfo.email,
        cpfCnpj: dto.creditCardHolderInfo.cpfCnpj,
        postalCode: dto.creditCardHolderInfo.postalCode,
        addressNumber: dto.creditCardHolderInfo.addressNumber,
        addressComplement: dto.creditCardHolderInfo?.addressComplement,
        mobilePhone: dto.creditCardHolderInfo?.mobilePhone,
        phone: dto.creditCardHolderInfo.phone,
      },
    };

    const URL = `${this.ASAAS_URL}/creditCard/tokenize`;

    try {
      const response = await this.httpService.axiosRef.post(
        URL,
        {
          ...data,
        },
        {
          headers: {
            access_token: this.ASAAS_AUTH,
          },
        },
      );

      return response.data;
    } catch (error) {
      const statusCode = error.response.status;
      const errors = error.response.data.errors[0];
      throw new HttpException({ ...errors }, statusCode);
    }
  }

  public async creditCard(
    dto: CreateChargeCardAsaasDto,
    card: CreditCardTokenizeAsaasDto,
  ): Promise<CreateChargeAsaasResponse> {
    const token = await this.creditCardTokenize(card);

    const URL = `${this.ASAAS_URL}/payments`;
    //trocar por cpf /cnpj do cara que comrpou
    //endereço do titular do cartao e do comprador pode vimd e lugar diferente

    try {
      const response = await this.httpService.axiosRef.post(
        URL,
        {
          ...dto,
          creditCardToken: token.creditCardToken,
          authorizeOnly: false,
          billingType: BillingType.CREDIT_CARD,
          creditCardHolderInfo: {
            name: card.creditCardHolderInfo.name,
            email: card.creditCardHolderInfo.email,
            cpfCnpj: card.creditCardHolderInfo.cpfCnpj,
            postalCode: card.creditCardHolderInfo.postalCode,
            addressNumber: card.creditCardHolderInfo.addressNumber,
            addressComplement: card.creditCardHolderInfo?.addressComplement,
            mobilePhone: card.creditCardHolderInfo?.mobilePhone,
            phone: card.creditCardHolderInfo.phone,
          },
        },
        {
          headers: {
            access_token: this.ASAAS_AUTH,
          },
        },
      );

      return response.data;
    } catch (error) {
      const statusCode = error.response.status;
      const errors = error.response.data.errors[0];
      throw new HttpException({ ...errors }, statusCode);
    }
  }

  public async getInvoiceDigitableBill(
    id: string,
  ): Promise<DigitableBillAsaasResponse> {
    const URL = `${this.ASAAS_URL}/payments/${id}/identificationField`;

    try {
      const response = await this.httpService.axiosRef.get(URL, {
        headers: {
          access_token: this.ASAAS_AUTH,
        },
      });

      return response.data;
    } catch (error) {
      const statusCode = error.response.status;
      const errors = error.response.data.errors[0];
      throw new HttpException({ ...errors }, statusCode);
    }
  }

  public async getpixQRCode(id: string): Promise<PixQrCodeAsaasResponse> {
    const URL = `${this.ASAAS_URL}/payments/${id}/pixQrCode`;

    try {
      const response = await this.httpService.axiosRef.get(URL, {
        headers: {
          access_token: this.ASAAS_AUTH,
        },
      });

      return response.data;
    } catch (error) {
      const statusCode = error.response.status;
      const errors = error.response.data.errors[0];
      throw new HttpException({ ...errors }, statusCode);
    }
  }
}
